import { Request, Response } from "express";
import RecruiterService from "./recruiter.service";
import sendEmail from "../Email/email.service";
import { log } from "console";
import { resetPasswordTemplate } from "../../views/resetPasswordTemplate";

const RecruiterController = {
    forgotPassword: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const user = await RecruiterService.getRecruiterByEmail(email);
            if (!user) {
                res.status(401).json({ success: false, message: "Email not found!" });
                return;
            }
            const companyName = user.org_name || "you";
            const url = `http://localhost:4080/recruiter/reset-password/${user.recruiter_id}`;
            const htmlContent = resetPasswordTemplate(companyName , url);

            await sendEmail(email, "Reset your password!", "", htmlContent);
            res.status(200).json({ success: true, message: "Password reset email sent successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    },

    resetPassword: async (req: Request, res: Response): Promise<void> => {
        try {
            const { password } = req.body;
            const userId = req.params.id;
            if (!password || !userId) {
                res.status(401).json({ success: false, message: "Something went wrong!" });
                return;
            }

            await RecruiterService.changePassword(userId, password);

            res.status(200).json({ success: true, message: "Password reset successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
}

export default RecruiterController;
