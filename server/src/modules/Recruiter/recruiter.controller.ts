import { Request, Response } from "express";
import RecruiterService from "./recruiter.service";
import { log } from "console";
import { resetPasswordTemplate } from "../../views/resetPasswordTemplate";
import EmailService from "../Email/email.service";
import { IRecruiter } from '../../types/IRecruiter';
import AuthService from '../Auth/auth.service';
import UserRole from '../../types/EnumUserRole';

const RecruiterController = {
    forgotPassword: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const data: IRecruiter | null = await RecruiterService.getRecruiterByEmail(email);
            // log(data)
            if (!data) {
                res.status(500).json({ success: false, message: "Email not found!" });
                return;
            }
            const companyName = data.orgName || "you";
            const url = `http://localhost:4080/recruiter/reset-password/${data._id}`;
            const htmlContent = resetPasswordTemplate(companyName, url);

            await EmailService.sendEmail(email, "Reset your password!", "", htmlContent);
            res.status(200).json({ success: true, message: "Password reset email sent successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, error: "Internal server error!" });
        }
    },

    resetPassword: async (req: Request, res: Response): Promise<void> => {
        try {
            const { password } = req.body;
            const userId = req.params.id;
            if (!password || !userId) {
                res.status(500).json({ success: false, message: "Something went wrong!" });
                return;
            }

            await AuthService.changePassword(userId, password, UserRole.RECRUITER);

            res.status(200).json({ success: true, message: "Password reset successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, error: "Internal server error!" });
        }
    },

    updateComapanyContact: async (req: Request, res: Response): Promise<void> => {
        const { email, mobile } = req.body;

    },

    updateComapanyProfile: async (req: Request, res: Response): Promise<void> => {

    }

}

export default RecruiterController;
