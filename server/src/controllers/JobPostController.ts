import { Request, Response } from "express";
import JobPostService from "../services/JobPostService";
import { BaseController } from "./BaseController";
import { log } from "console";
import axios from "axios";
import CandidateModel from "../models/CandidateModel";
import JobPostModel from "../models/JobPostModel";
import { scaleScore, transformCV } from "../utils/CVHandler";

export default class JobPostController extends BaseController {
    private jobPostService: JobPostService;

    constructor(jobPostService: JobPostService) {
        super();
        this.jobPostService = jobPostService;
    }

    public getAllJobPosts = async (req: Request, res: Response) => {
        try {
            const { page, pageSize } = req.query;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);

            const result = page && pageSize
                ? await this.jobPostService.getJobPostsByPage(Number(page), Number(pageSize))
                : await this.jobPostService.getAllJobPosts();

            if (!result) {
                return this.sendError(res, 404, 'Jobs not found!');
            }

            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getJobsByCandidate = async (req: Request, res: Response) => {
        try {
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const result = await this.jobPostService.getJobPostsByUserId(userInfo.userId);
            if (!result || result.length === 0) {
                return this.sendError(res, 404, 'Jobs not found!');
            }

            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getJobDetail = async (req: Request, res: Response) => {
        try {
            const { jobPostId } = req.params;
            const result = await this.jobPostService.findByJobPostId(jobPostId);
            if (!result) {
                return this.sendError(res, 404, 'Job not found!');
            }

            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getJobDetailByCandidate = async (req: Request, res: Response) => {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const result = await this.jobPostService.findByJobPostId(jobPostId);
            const isSaved = await this.jobPostService.isSavedJobPost(userInfo.userId, jobPostId);
            return this.sendResponse(res, 200, { success: true, isLiked: isSaved, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getSavedJobs = async (req: Request, res: Response) => {
        try {
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const result = await this.jobPostService.getSavedJobs(userInfo.userId);
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getAppliedJobs = async (req: Request, res: Response) => {
        try {
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const result = await this.jobPostService.getJobApplied(userInfo.userId);
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public createJobPost = async (req: Request, res: Response) => {
        try {
            const jobPostData = req.body.data;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            log('jobPostData', jobPostData);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const isCreated = await this.jobPostService.createJobPost(userInfo.userId, jobPostData);
            if (!isCreated) {
                return this.sendError(res, 400, 'Failed to create job post!');
            }

            return this.sendResponse(res, 201, { success: true, message: 'Job created successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public deleteJobPost = async (req: Request, res: Response) => {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const isDeleted = await this.jobPostService.deleteJobPost(userInfo, jobPostId);
            if (!isDeleted) {
                return this.sendError(res, 400, 'Failed to delete job post!');
            }

            return this.sendResponse(res, 200, { success: true, message: 'Job deleted successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public createApplication = async (req: Request, res: Response) => {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const isCreated = await this.jobPostService.createApplication(userInfo.userId, jobPostId);
            const cv = await CandidateModel.findOne({ userId: userInfo.userId }).lean().exec();
            const jd = await JobPostModel.findById(jobPostId).lean().exec();

            if (!cv || !jd) {
                return this.sendError(res, 404, "CV or Job Post not found");
            }

            const cvData = { educations: cv.educations, languages: cv.languages, certifications: cv.certifications } as any;
            const jdData = { languages: jd.languagesRequired };

            const transformedCV = transformCV(cvData);
            const transformedJD = transformCV(jdData);
            const input = {
                professionalSkillsCV: cv.professionalSkills ? JSON.stringify(cv.professionalSkills) : "",
                educationsCV: cv.educations ? JSON.stringify(transformedCV.educations) : "[]",
                languagesCV: cv.languages ? JSON.stringify(transformedCV.languages) : "[]",
                certificationsCV: cv.certifications ? JSON.stringify(transformedCV.certifications) : "[]",
                professionalSkillsJob: jd.professionalSkills ? JSON.stringify(jd.professionalSkills) : "",
                educationsJob: jd.educationRequired || "",
                languagesJob: jd.languagesRequired ? JSON.stringify(transformedJD.languages) : "[]",
                certificationsJob: jd.certificateRequired || "",
            };

            log('input', input);

            const response = await axios.post(`http://localhost:8000/get_percents`, input, {
                headers: { 'Content-Type': 'application/json' },
            });

            const aiResult = {
                professionalSkills: response.data.score_skill,
                educations: response.data.score_edu,
                languages: response.data.score_lang,
                certifications: response.data.score_cer,
            };

            const scaledResult = {
                professionalSkills: scaleScore(aiResult.professionalSkills, 50),
                educations: scaleScore(aiResult.educations, 15),
                languages: scaleScore(aiResult.languages, 15),
                certifications: scaleScore(aiResult.certifications, 20),
            };

            log('aiResult', aiResult);
            log('scaledResult', scaledResult);

            const isUpdated = this.jobPostService.saveAIResult(userInfo.userId, jobPostId, scaledResult);

            if (!isCreated || !isUpdated) {
                return this.sendResponse(res, 406, { success: false, message: 'Maybe has been applied in this job!' });
            }

            return this.sendResponse(res, 201, { success: true, message: 'Application created successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public deleteApplication = async (req: Request, res: Response) => {
        try {
            const { jobPostId, candidateId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const isDeleted = await this.jobPostService.deleteApplication(candidateId, jobPostId);
            if (!isDeleted) {
                return this.sendError(res, 400, 'Failed to delete application!');
            }

            return this.sendResponse(res, 200, { success: true, message: 'Application deleted successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public saveJobPost = async (req: Request, res: Response) => {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const isSaved = await this.jobPostService.saveJobPost(userInfo.userId, jobPostId);
            if (!isSaved) {
                return this.sendError(res, 400, 'Failed to save job post!');
            }

            return this.sendResponse(res, 201, { success: true, isLiked: true, message: 'Job saved successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public unSaveJobPost = async (req: Request, res: Response) => {
        try {
            const { jobPostId } = req.params;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const isDeleted = await this.jobPostService.unSaveJobPost(userInfo.userId, jobPostId);
            if (!isDeleted) {
                return this.sendError(res, 400, 'Failed to unsave job post!');
            }

            return this.sendResponse(res, 200, { success: true, isLiked: false, message: 'Job unsaved successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public setApplyStatus = async (req: Request, res: Response) => {
        try {
            const { jobPostId, candidateId, status } = req.body;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, 'Authentication required!');
            }

            const result = await this.jobPostService.setApplyStatus(userInfo.userId, jobPostId, candidateId, status);
            if (!result) {
                return this.sendError(res, 400, 'Failed to set apply status!');
            }

            return this.sendResponse(res, 200, { success: true, message: 'Apply status set successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    private processJobPostRequest = async (
        req: Request,
        res: Response,
        fields: { key: string, fallback: string }[]
    ) => {
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
    };

    public findByCondition = async (req: Request, res: Response) => {
        return this.processJobPostRequest(req, res, [
            { key: 'jobTitle', fallback: '' },
            { key: 'location', fallback: '' },
            { key: 'industry', fallback: '' },
        ]);
    };

    public getRelatedJobPosts = async (req: Request, res: Response) => {
        return this.processJobPostRequest(req, res, [
            { key: 'jobTitle', fallback: '' },
            { key: 'location', fallback: '' },
            { key: 'yearsOfExperience', fallback: '' },
        ]);
    };

    public getJobPostsByRecruiter = async (req: Request, res: Response) => {
        try {
            const userInfo = (req as any).userData;
            log('userInfo', userInfo);
            const result = await this.jobPostService.getJobPostsByRecruiter(userInfo.userId);
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getJobPostedByRecruiter = async (req: Request, res: Response) => {
        try {
            const { recruiterId } = req.params;
            const result = await this.jobPostService.getJobPostedByRecruiter(recruiterId);
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getTopRecruiters = async (req: Request, res: Response) => {
        try {
            const result = await this.jobPostService.getTopRecruiters();
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };

    public getTopJobSalaries = async (req: Request, res: Response) => {
        try {
            const result = await this.jobPostService.getTopJobSalaries();
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    };
}
