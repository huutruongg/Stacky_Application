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

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { privateEmail } = req.body;
        try {
            const isProcessed = await this.authService.forgotPassword(privateEmail);
            if (!isProcessed) {
                return this.sendError(res, 404, "User not found");
            }
            return this.sendResponse(res, 200, { success: true, message: "Email sent successfully!" });
        } catch (error) {
            log("Error sending password reset email:", error);
            return this.sendError(res, 500, "An error occurred while sending the email.");
        }
    };

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { password } = req.body;
            const userId = req.params.userId;
            const isReset = await this.authService.changePassword(userId, password);
            if (!isReset) {
                return this.sendError(res, 400, "User ID is required!");
            }
            return this.sendResponse(res, 200, { success: true, message: "Password reset successfully!" });
        } catch (error) {
            log("Error resetting password:", error);
            return this.sendError(res, 500, "An error occurred while resetting the password.");
        }
    };

    public getCompanyInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;
            const result = await this.recruiterService.getRecruiterByUserId(userId);
            if (!result) {
                return this.sendError(res, 404, "Recruiter not found");
            }
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            log("Error fetching company info:", error);
            return this.sendError(res, 500, "An error occurred while fetching the company info.");
        }
    };

    public getApplicants = async (req: Request, res: Response): Promise<void> => {
        try {
            const jobPostId = req.params.jobPostId;
            if (!jobPostId) {
                return this.sendError(res, 400, "Job Post ID is required.");
            }
            const applicants = await this.applicantService.getCandidatesApplied(jobPostId);
            return this.sendResponse(res, 200, { success: true, result: applicants });
        } catch (error) {
            log("Error fetching applicants:", error);
            return this.sendError(res, 500, "An error occurred while fetching the applicants.");
        }
    };

    public updateCompanyInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const userInfo = (req as any).userData;
            if (!data || !userInfo) {
                return this.sendError(res, 400, "Company info is required.");
            }
            const updatedInfo = await this.recruiterService.updateCompanyInfo(userInfo.userId, data);
            if (!updatedInfo) {
                return this.sendError(res, 404, "Company info not found.");
            }
            return this.sendResponse(res, 200, { success: true, message: "Company info updated successfully!" });
        } catch (error) {
            log("Error updating company info:", error);
            return this.sendError(res, 500, "An error occurred while updating the company info.");
        }
    };

    public updateCompanyAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const userInfo = (req as any).userData;
            if (!data || !userInfo) {
                return this.sendError(res, 400, "Company account is required.");
            }
            const updatedCompany = await this.recruiterService.updateCompanyAccount(userInfo.userId, data);
            const updatedUser = await this.userServices.updateUserProfile(userInfo.userId, data);
            if (!updatedCompany || !updatedUser) {
                return this.sendError(res, 404, "Company account not found.");
            }
            return this.sendResponse(res, 200, { success: true, message: "Company account updated successfully!" });
        } catch (error) {
            log("Error updating company account:", error);
            return this.sendError(res, 500, "An error occurred while updating the company account.");
        }
    };

    public getListCompany = async (req: Request, res: Response): Promise<void> => {
        try {
            const { search, page, pageSize } = req.query;
            let companies;
            if (page && pageSize && search) {
                companies = await this.recruiterService.getListCompanyByPage(String(search), Number(page), Number(pageSize));
            } else {
                companies = await this.recruiterService.getListCompany();
            }
            if (!companies) {
                return this.sendError(res, 404, "No companies found.");
            }
            return this.sendResponse(res, 200, { success: true, result: companies });
        } catch (error) {
            log("Error fetching companies:", error);
            return this.sendError(res, 500, "An error occurred while fetching the companies.");
        }
    };

    public getPotentialCandidate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { jobPostId, candidateId } = req.params;
            if (!jobPostId || !candidateId) {
                return this.sendError(res, 400, "Job Post ID and Candidate ID are required.");
            }
            const candidates = await this.applicantService.getPotentialCandidate(jobPostId, candidateId);
            if (!candidates) {
                return this.sendError(res, 404, "No potential candidates found.");
            }
            return this.sendResponse(res, 200, { success: true, result: candidates });
        } catch (error) {
            log("Error fetching potential candidates:", error);
            return this.sendError(res, 500, "An error occurred while fetching the potential candidates.");
        }
    };

    public updateCandidatesStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { jobPostId, candidateIds, status } = req.body;
            if (!jobPostId || !candidateIds || !status) {
                return this.sendError(res, 400, "Job Post ID, candidate IDs, and status are required.");
            }
            const updatedCandidates = await this.applicantService.updateCandidatesStatus(jobPostId, candidateIds, status);
            if (!updatedCandidates) {
                return this.sendError(res, 404, "Candidates not found.");
            }
            return this.sendResponse(res, 200, { success: true, message: "Candidates status updated successfully!" });
        } catch (error) {
            log("Error updating candidates status:", error);
            return this.sendError(res, 500, "An error occurred while updating the candidates status.");
        }
    };
}
