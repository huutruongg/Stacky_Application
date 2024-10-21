import { Request, Response } from "express";
import JobPostService from "../services/JobPostService";
import { BaseController } from "./BaseController";
import { log } from "console";
import { UserRole } from "../enums/EUserRole";
import { get } from "http";
import { IUserDataType } from "../interfaces/IUserData";
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
            let result;

            if (!page || !pageSize) {
                result = await this.jobPostService.getAllJobPosts();
            } else {
                result = await this.jobPostService.getJobPostsByPage(
                    Number(page),
                    Number(pageSize)
                );
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
            if (!result || !isSaved) {
                return this.sendError(res, 404, new Error("Job not found!").message);
            }

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
            if (!result || result.length === 0) {
                return this.sendError(res, 404, new Error("Jobs not found!").message);
            }
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
            if (!result || result.length === 0) {
                return this.sendError(res, 404, new Error("Jobs not found!").message);
            }

            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            return this.sendError(res, 500, new Error("Internal Server Error!").message);
        }
    }

    public async findByCondition(req: Request, res: Response) {
        try {
            const { keySearch, location, industry } = req.query;
            if (typeof keySearch !== 'string' || typeof location !== 'string' || typeof industry !== 'string') {
                return this.sendError(res, 400, 'Invalid query parameters!');
            }

            const keyString = keySearch.replace(/-/g, ' ');
            const locationString = location.replace(/-/g, ' ');
            const industryString = industry.replace(/-/g, ' ');
            log("LOGGGGGGGGGG: ", keyString.trim() as string, locationString.trim() as string, industryString.trim() as string);

            const result = await this.jobPostService.findByCondition(
                keyString.trim() as string, locationString.trim() as string, industryString.trim() as string
            );
            if (!result || result.length === 0) {
                return this.sendError(res, 404, 'Jobs not found!');
            }

            return this.sendResponse(res, 200, { success: true, result });
        }
        catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async createJobPost(req: Request, res: Response) {
        try {
            const jobPostData = req.body;
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
            const result = await this.jobPostService.createApplication(userInfo.userId, jobPostId);
            if (!result) {
                return this.sendError(res, 400, 'Failed to create application!');
            }
            return this.sendResponse(res, 201, { success: true, message: 'Application created successfully!' });
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
            const { jobPostId, applicantId, status } = req.body;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const result = await this.jobPostService.setApplyStatus(userInfo.userId, jobPostId, applicantId, status);
            if (!result) {
                return this.sendError(res, 400, 'Failed to set apply status!');
            }
            return this.sendResponse(res, 200, { success: true, message: 'Apply status set successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }

    async censorJobPost(req: Request, res: Response) {
        try {
            const { jobPostId, status } = req.body;
            const userInfo = await (req as any).userData;
            log('userInfo', userInfo);
            if (!userInfo) {
                return this.sendError(res, 401, new Error('Authentication required!').message);
            }
            const result = await this.jobPostService.censorJobPost(userInfo.role, jobPostId, status);
            if (!result) {
                return this.sendError(res, 400, 'Failed to censor job post!');
            }
            return this.sendResponse(res, 200, { success: true, message: 'Job post censored successfully!' });
        } catch (error) {
            return this.sendError(res, 500, 'Internal Server Error!');
        }
    }
}