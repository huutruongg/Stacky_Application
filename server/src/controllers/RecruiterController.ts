import { log } from "console";
import AuthService from "../services/AuthService";
import RecruiterService from "../services/RecruiterService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
export default class RecruiterController extends BaseController {
    private recruiterService: RecruiterService;
    private authService: AuthService;

    constructor(recruiterService: RecruiterService, authService: AuthService) {
        super();
        this.recruiterService = recruiterService;
        this.authService = authService;
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
}