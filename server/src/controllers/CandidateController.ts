import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import CandidateService from "../services/CandidateService";
import UserService from "../services/UserService";
import { log } from "console";
import { IUserDataType } from "../interfaces/IUserData";
import { IProfile } from "../interfaces/ICandidate";
import { DeleteCandidateSchema, UpdateCandidateInfoSchema, UpdateCandidateProfileSchema } from "../utils/validations/CandidateValidation";

export default class CandidateController extends BaseController {
    private candidateService: CandidateService;
    private userService: UserService;

    constructor(
        candidateService: CandidateService,
        userService: UserService
    ) {
        super();
        this.candidateService = candidateService;
        this.userService = userService;
    }

    async getCandidate(req: Request, res: Response) {
        try {
            const userInfo = await (req as any).userData;
            const userId = userInfo.userId;
            const candidate = await this.candidateService.getCandidateByUserId(userId);
            log("Candidate: ", candidate);
            if (!candidate) {
                return this.sendError(res, 404, "Candidate not found");
            }
            return this.sendResponse(res, 200, { success: true, result: candidate });
        } catch (error) {
            return this.sendError(res, 500, "Failed to get candidate");
        }
    }

    async getAppliedJobs(req: Request, res: Response) {
        try {
            const userInfo = await (req as any).userData;
            const userId = userInfo.userId;
            const appliedJobs = await this.candidateService.getAppliedJobs(userId);
            if (!appliedJobs) {
                return this.sendError(res, 404, "Applied jobs not found");
            }
            return this.sendResponse(res, 200, { success: true, result: appliedJobs });
        } catch (error) {
            return this.sendError(res, 500, "Failed to get applied jobs");
        }
    }

    async updateCandidate(req: Request, res: Response) {
        try {
            const data = req.body;
            const userInfo = await (req as any).userData;
            // const { error } = UpdateCandidateInfoSchema.validate(req.body, { abortEarly: false });
            // if (error) {
            //     return this.sendError(res, 400, error.message);
            // }
            const isProfileUpdated = await this.candidateService.updateProfile(userInfo.userId, data);
            const isProfessionalInfoUpdated = await this.candidateService.updateProfessionalInfo(userInfo.userId, data);
            // log("isProfileUpdated", isProfileUpdated);
            // log("isProfessionalInfoUpdated", isProfessionalInfoUpdated);
            if (!isProfileUpdated || !isProfessionalInfoUpdated) {
                return this.sendError(res, 500, "Failed to update candidate");
            }
            return this.sendResponse(res, 200, { success: true, message: "Candidate updated successfully" });
        } catch (error) {
            return this.sendError(res, 500, "Failed to get candidate");
        }
    }

    async deleteCandidate(req: Request, res: Response) {
        try {
            const { error } = DeleteCandidateSchema.validate(req.params.userId, { abortEarly: false });
            if (error) {
                return this.sendError(res, 400, error.message);
            }
            const { userId } = req.params;
            log("Deleting candidate with userId: ", userId);

            const isCandidateDeleted = await this.candidateService.deleteCandidate(userId);
            const isUserDeleted = await this.userService.deleteUser(userId);

            if (isCandidateDeleted && isUserDeleted) {
                return this.sendResponse(res, 200, { success: true, message: "Candidate deleted successfully" });
            } else {
                return this.sendError(res, 500, "Failed to delete candidate");
            }
        } catch (error) {
            return this.sendError(res, 500, "Failed to delete candidate");
        }
    }

    async getCandidateProfile(req: Request, res: Response) {
        try {
            const userInfo = await (req as any).userData;
            const userId = userInfo.userId;
            const candidate = await this.candidateService.getCandidateByUserId(userId);
            const user = await this.userService.getUserById(userId);
            if (!candidate || !user) {
                return this.sendError(res, 404, "Candidate not found");
            }
            const data = {
                avatarUrl: candidate.avatarUrl,
                fullName: candidate.fullName,
                publicEmail: candidate.publicEmail,
                phoneNumber: user.phoneNumber
            } as IProfile;
            return this.sendResponse(res, 200, { success: true, result: data });
        } catch (error) {
            return this.sendError(res, 500, "Failed to get candidate");
        }
    }

    async updateCandidateProfile(req: Request, res: Response) {
        try {
            const { error } = UpdateCandidateProfileSchema.validate(req.body, { abortEarly: false });
            if (error) {
                return this.sendError(res, 400, error.message);
            }
            const data = req.body;
            const userInfo = await (req as any).userData;
            const isProfileUpdated = await this.candidateService.updateCandidateProfile(userInfo.userId, data);
            const isUserUpdated = await this.userService.updateUserProfile(userInfo.userId, data);
            if (!isProfileUpdated || !isUserUpdated) {
                return this.sendError(res, 500, "Failed to update candidate profile");
            }
            return this.sendResponse(res, 200, { success: true, message: "Candidate profile updated successfully" });
        } catch (error) {
            return this.sendError(res, 500, "Failed to update candidate profile");
        }
    }
}
