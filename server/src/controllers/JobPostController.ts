import { Request, Response } from "express";
import JobPostService from "../services/JobPostService";
import { BaseController } from "./BaseController";
import { log } from "console";
import { UserRoles } from "../utils/roles";
import { get } from "http";
import { IUserDataType } from "../interfaces/IUserData";
import axios from "axios";
import { IEducation } from "../interfaces/IEducation";
import { ILanguage } from "../interfaces/ILanguage";
import { ICertification } from "../interfaces/ICertification";
import { scaleScore, transformCV } from "../utils/CVHandler";
import CandidateModel from "../models/CandidateModel";
import JobPostModel from "../models/JobPostModel";
import { IAIResult } from "../interfaces/ICandidate";
import { IJobPost } from "../interfaces/IJobPost";
// import { getUserInfo } from "../middlewares/authenticate.m";

export default class JobPostController extends BaseController {
    private jobPostService: JobPostService;
    constructor(jobPostService: JobPostService) {
        super();
        this.jobPostService = jobPostService;
    }

    public async getAllJobPosts(req: Request, res: Response) {
        try {
            const { page, pageSize } = req.query;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            let result;

            if (!page || !pageSize) {
                result = await this.jobPostService.getAllJobPosts();
            } else {
                result = await this.jobPostService.getJobPostsByPage(Number(page), Number(pageSize));
            }

            if (!result) {
                return this.sendError(res, 404, 'Jobs not found!');
            }

            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    public async getJobsByCandidate(req: Request, res: Response) {
        try {
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error("Authentication required!").message);

            }
            const result = await this.jobPostService.getJobPostsByUserId(userInfo.userId);
            if (!result || result.length === 0) {
                return this.sendError(res, 404, new Error("Jobs not found!").message);
            }
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, new Error("Internal Server Error!").message);
        }
    }

    public async getJobDetail(req: Request, res: Response) {
        try {
            const { jobPostId } = req.params;
            const result = await this.jobPostService.findByJobPostId(jobPostId);
            if (!result) {
                return this.sendError(res, 404, new Error("Job not found!").message);
            }
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, new Error("Internal Server Error!").message);
        }
    }

    public async getJobDetailByCandidate(req: Request, res: Response) {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error("Authentication required!").message);
            }
            const result = await this.jobPostService.findByJobPostId(jobPostId);
            const isSaved = await this.jobPostService.isSavedJobPost(userInfo.userId, jobPostId);
            return this.sendResponse(res, 200, { success: true, isLiked: isSaved, result });
        } catch (error) {
            return this.sendError(res, 500, new Error("Internal Server Error!").message);
        }
    }

    public async getSavedJobs(req: Request, res: Response) {
        try {
            // const { userId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error("Authentication required!").message);
            }
            const result = await this.jobPostService.getSavedJobs(userInfo.userId);
            // if (!result || result.length === 0) {
            //     return this.sendError(res, 404, new Error("Jobs not found!").message);
            // }
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, new Error("Internal Server Error!").message);
        }
    }

    public async getAppliedJobs(req: Request, res: Response) {
        try {
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error("Authentication required!").message);
            }
            const result = await this.jobPostService.getJobApplied(userInfo.userId);

            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, new Error("Internal Server Error!").message);
        }
    }



    async createJobPost(req: Request, res: Response) {
        try {
            const jobPostData = req.body.data;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            log('jobPostData', jobPostData);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const isCreated = await this.jobPostService.createJobPost(userInfo.userId, jobPostData);
            if (!isCreated) {
                return this.sendError(res, 400, 'Failed to create job post!');
            }
            return this.sendResponse(res, 201, { success: true, message: 'Job created successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async deleteJobPost(req: Request, res: Response) {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const isDeleted = await this.jobPostService.deleteJobPost(userInfo, jobPostId);
            if (!isDeleted) {
                return this.sendError(res, 400, 'Failed to delete job post!');
            }
            return this.sendResponse(res, 200, { success: true, message: 'Job deleted successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async createApplication(req: Request, res: Response) {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            // 1. create application in db
            const isCreated = await this.jobPostService.createApplication(userInfo.userId, jobPostId);
            // 2. Send data to AI model
            async function getCV(userId: string) {
                return await CandidateModel.findOne({ userId: userId }).lean().exec();
            }
            async function getJobPost(jobPostId: string) {
                return await JobPostModel.findById(jobPostId).lean().exec();
            }
            const cv = await getCV(userInfo.userId);
            const jd = await getJobPost(jobPostId);

            if (!cv || !jd) {
                return this.sendError(res, 404, "CV or Job Post not found");
            }
            const cvData = {
                educations: cv.educations,
                languages: cv.languages,
                certifications: cv.certifications,
            } as { educations: IEducation[], languages: ILanguage[], certifications: ICertification[] };
            const jdData = {
                languages: jd.languagesRequired,
            } as { languages: ILanguage[] };

            const transformedCV = transformCV(cvData);
            const transformedJD = transformCV(jdData);
            const input = {
                professionalSkillsCV: cv.professionalSkills,
                educationsCV: JSON.stringify(transformedCV.educations),
                languagesCV: JSON.stringify(transformedCV.languages),
                certificationsCV: JSON.stringify(transformedCV.certifications),
                professionalSkillsJob: jd.professionalSkills,
                educationsJob: jd.educationRequired,
                languagesJob: JSON.stringify(transformedJD.languages),
                certificationsJob: jd.certificateRequired,
            };

            log('input', input);

            const response = await axios.post(`http://localhost:8000/get_percents`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 3. Save AI result to db
            const aiResult = {
                professionalSkills: response.data.score_skill,
                educations: response.data.score_edu,
                languages: response.data.score_lang,
                certifications: response.data.score_cer,
            } as IAIResult;
            // Map raw scores to the new scales
            const scaledResult = {
                professionalSkills: scaleScore(aiResult.professionalSkills, 50),
                educations: scaleScore(aiResult.educations, 15),
                languages: scaleScore(aiResult.languages, 15),
                certifications: scaleScore(aiResult.certifications, 20),
            };
            log('aiResult', aiResult);
            log('scaledResult', scaledResult);
            const isUpdated = this.jobPostService.saveAIResult(userInfo.userId, jobPostId, scaledResult);
            // 4. Return response
            if (!isCreated || !isUpdated) {
                return this.sendError(res, 400, 'Failed to create application!');
            }
            return this.sendResponse(res, 201, { success: true, message: 'Application created successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async deleteApplication(req: Request, res: Response) {
        try {
            const { jobPostId, candidateId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const isDeleted = await this.jobPostService.deleteApplication(candidateId, jobPostId);
            if (!isDeleted) {
                return this.sendError(res, 400, 'Failed to delete application!');
            }
            return this.sendResponse(res, 200, { success: true, message: 'Application deleted successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async saveJobPost(req: Request, res: Response) {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const isSaved = await this.jobPostService.saveJobPost(userInfo.userId, jobPostId);
            if (!isSaved) {
                return this.sendError(res, 400, 'Failed to save job post!');
            }
            return this.sendResponse(res, 201, { success: true, isLiked: true, message: 'Job saved successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async unSaveJobPost(req: Request, res: Response) {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const isDeleted = await this.jobPostService.unSaveJobPost(userInfo.userId, jobPostId);

            if (!isDeleted) {
                return this.sendError(res, 400, 'Failed to unsave job post!');
            }

            return this.sendResponse(res, 200, { success: true, isLiked: false, message: 'Job unsaved successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async setApplyStatus(req: Request, res: Response) {
        try {
            const { jobPostId, candidateId, status } = req.body;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const result = await this.jobPostService.setApplyStatus(userInfo.userId, jobPostId, candidateId, status);
            if (!result) {
                return this.sendError(res, 400, 'Failed to set apply status!');
            }
            return this.sendResponse(res, 200, { success: true, message: 'Apply status set successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    private async processJobPostRequest(
        req: Request,
        res: Response,
        fields: { key: string, fallback: string }[]
    ) {
        try {
            const queryParams: Record<string, string> = {};

            for (const { key, fallback } of fields) {
                const value = req.query[key];
                if (typeof value !== 'string') {
                    return this.sendError(res, 400, `Invalid query parameter: ${key}`);
                }
                queryParams[key] = value.replace(/_/g, ' ').trim();
            }

            const result = await this.jobPostService.findByCondition(queryParams);
            if (!result || result.length === 0) {
                return this.sendResponse(res, 200, { success: true, result: [] });
            }

            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    public async findByCondition(req: Request, res: Response) {
        return this.processJobPostRequest(req, res, [
            { key: 'jobTitle', fallback: '' },
            { key: 'location', fallback: '' },
            { key: 'industry', fallback: '' },
        ]);
    }

    public async getRelatedJobPosts(req: Request, res: Response) {
        return this.processJobPostRequest(req, res, [
            { key: 'jobTitle', fallback: '' },
            { key: 'location', fallback: '' },
            { key: 'yearsOfExperience', fallback: '' },
        ]);
    }

    public async getJobPostsByRecruiter(req: Request, res: Response) {
        try {
            const userInfo = (req as any).userData;
            log('userInfo', userInfo);
            const result = await this.jobPostService.getJobPostsByRecruiter(userInfo.userId);
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    public async getJobPostedByRecruiter(req: Request, res: Response) {
        try {
            const { recruiterId } = req.params;
            const result = await this.jobPostService.getJobPostedByRecruiter(recruiterId);
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }
}