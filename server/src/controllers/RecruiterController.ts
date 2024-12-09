import { log } from "console";
import AuthService from "../services/AuthService";
import RecruiterService from "../services/RecruiterService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
import ApplicantService from "../services/ApplicantService";
import UserService from "../services/UserService";
export default class RecruiterController extends BaseController {
    private recruiterService: RecruiterService;
    private authService: AuthService;
    private applicantService: ApplicantService;
    private userServices: UserService;
    constructor(recruiterService: RecruiterService, authService: AuthService, applicantService: ApplicantService, userServices: UserService) {
        super();
        this.recruiterService = recruiterService;
        this.authService = authService;
        this.applicantService = applicantService;
        this.userServices = userServices;
    }

    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { privateEmail } = req.body;
        try {
            const isProcessed = await this.authService.forgotPassword(privateEmail);
            if (!isProcessed) {
                return this.sendError(res, 404, new Error("User not found").message);
            }
            return this.sendResponse(res, 200, { success: true, message: "Email sent successfully!" });
        } catch (error) {
            log("Error sending password reset email:", error);
            return this.sendError(res, 500, "An error occurred while sending the email.");
        }
    }

    public async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { password } = req.body;
            const userId = req.params.userId;
            const isReset = await this.authService.changePassword(userId, password);
            if (!isReset) {
                return this.sendError(res, 400, new Error("User ID is required!").message);
            }
            return this.sendResponse(res, 200, { success: true, message: "Password reset successfully!" });
        } catch (error) {
            log("Error resetting password:", error);
            return this.sendError(res, 500, "An error occurred while resetting the password.");
        }
    }

    public async getCompanyInfo(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const result = await this.recruiterService.getRecruiterByUserId(userId);
            if (!result) {
                return this.sendError(res, 404, new Error("Recruiter not found").message);
            }
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            log("Error fetching company info:", error);
            return this.sendError(res, 500, "An error occurred while fetching the company info.");
        }
    }

    async getApplicants(req: Request, res: Response) {
        try {
            const jobPostId = req.params.jobPostId;
            if (!jobPostId) {
                return this.sendError(res, 400, new Error("Job Post ID is required.").message);
            }
            const applicants = await this.applicantService.getCandidatesApplied(jobPostId);
            // if (!applicants) {
            //     return this.sendError(res, 404, new Error("No applicants found.").message);
            // }
            return this.sendResponse(res, 200, { success: true, result: applicants });
        } catch (error) {
            log("Error fetching applicants:", error);
            return this.sendError(res, 500, "An error occurred while fetching the applicants.");

        }
    }

    async updateComapanyInfo(req: Request, res: Response) {
        try {
            const data = req.body;
            const userInfo = (req as any).userData;
            if (!data || !userInfo) {
                return this.sendError(res, 400, new Error("Company info is required.").message);
            }
            const updatedInfo = await this.recruiterService.updateCompanyInfo(userInfo.userId, data);
            if (!updatedInfo) {
                return this.sendError(res, 404, new Error("Company info not found.").message);
            }
            return this.sendResponse(res, 200, { success: true, message: "Company info updated successfully!" });

        } catch (error) {
            log("Error updating company info:", error);
            return this.sendError(res, 500, "An error occurred while updating the company info.");
        }
    }

    async updateComapanyAccount(req: Request, res: Response) {
        try {
            const data = req.body;
            const userInfo = (req as any).userData;
            if (!data || !userInfo) {
                return this.sendError(res, 400, new Error("Company account is required.").message);
            }
            const updatedCompany = await this.recruiterService.updateCompanyAccount(userInfo.userId, data);
            const updatedUser = await this.userServices.updateUserProfile(userInfo.userId, data);
            if (!updatedCompany || !updatedUser) {
                return this.sendError(res, 404, new Error("Company account not found.").message);
            }
            return this.sendResponse(res, 200, { success: true, message: "Company account updated successfully!" });

        } catch (error) {
            log("Error updating company account:", error);
            return this.sendError(res, 500, "An error occurred while updating the company account.");
        }
    }

    async getListCompany(req: Request, res: Response) {
        try {
            const { search, page, pageSize } = req.query;
            let companies;
            if(page && pageSize && search) {
                companies = await this.recruiterService.getListCompanyByPage(String(search), Number(page), Number(pageSize));
            } else {
                companies = await this.recruiterService.getListCompany();
            }
            if (!companies) {
                return this.sendError(res, 404, new Error("No companies found.").message);
            }
            return this.sendResponse(res, 200, { success: true, result: companies });
        } catch (error) {
            log("Error fetching companies:", error);
            return this.sendError(res, 500, "An error occurred while fetching the companies.");
        }
    }

    async getPotentialCandidate(req: Request, res: Response) {
        try {
            const { jobPostId, candidateId } = req.params;
            if (!jobPostId || !candidateId) {
                return this.sendError(res, 400, new Error("Job Post ID and Candidate ID are required.").message);
            }
            const candidates = await this.applicantService.getPotentialCandidate(jobPostId, candidateId);
            if (!candidates) {
                return this.sendError(res, 404, new Error("No potential candidates found.").message);
            }
            return this.sendResponse(res, 200, { success: true, result: candidates });
        } catch (error) {
            log("Error fetching potential candidates:", error);
            return this.sendError(res, 500, "An error occurred while fetching the potential candidates.");
        }
    }
}