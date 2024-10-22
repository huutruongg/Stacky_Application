import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import CandidateService from "../services/CandidateService";
import UserService from "../services/UserService";
import { log } from "console";
import { IUserDataType } from "../interfaces/IUserData";

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
            return this.handleServerError(res, error);
        }
    }

    async updateCandidate(req: Request, res: Response) {
        try {
            const data = req.body;
            const userInfo = await (req as any).userData;
            log("userInfo", userInfo);
            log("data", data);
            const isProfileUpdated = await this.candidateService.updateProfile(userInfo.userId, data);
            const isProfessionalInfoUpdated = await this.candidateService.updateProfessionalInfo(userInfo.userId, data);

            if (!isProfileUpdated || !isProfessionalInfoUpdated) {
                return this.sendError(res, 500, "Failed to update candidate");
            }
            return this.sendResponse(res, 200, { success: true, message: "Candidate updated successfully" });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async deleteCandidate(req: Request, res: Response) {
        try {
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
            return this.handleServerError(res, error);
        }
    }

    private handleServerError(res: Response, error: unknown) {
        log("Error: ", error);
        return this.sendError(res, 500, (error as Error).message);
    }
}
