import { Request, Response } from "express";
import RecruiterService from "./recruiter.service";
import { log } from "console";
import { resetPasswordTemplate } from "../../views/resetPasswordTemplate";
import EmailService from "../Email/email.service";
import { IRecruiter } from '../../types/IRecruiter';
import AuthService from '../Auth/auth.service';
import UserRole from '../../types/EnumUserRole';
import { handleValidationError } from "../../utils/errors/handle.error";
import { RecruiterValidation } from "../../utils/validations/recruiter.validate";
import { recruiterIdValidationSchema } from "../../utils/validations/recruiter.validation";

const RecruiterController = {
    forgotPassword: async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate the request body
            const { error } = RecruiterValidation.forgotPasswordSchema.validate(req.body);
            if (handleValidationError(error, res)) return;

            const { privateEmail } = req.body;
            const data: IRecruiter | null = await RecruiterService.getRecruiterByEmail(privateEmail);

            if (!data) {
                res.status(404).json({ success: false, message: "Email not found!" });
                return;
            }

            const companyName = data.orgName || "you";
            const url = `http://localhost:4080/recruiter/reset-password/${data._id}`;
            const htmlContent = resetPasswordTemplate(companyName, url);

            await EmailService.sendEmail(privateEmail, "Reset your password!", "", htmlContent);
            res.status(200).json({ success: true, message: "Password reset email sent successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, error: "Internal server error!" });
        }
    },

    resetPassword: async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate the request body
            const { error } = RecruiterValidation.resetPasswordSchema.validate(req.body);
            if (handleValidationError(error, res)) return;

            const { password } = req.body;
            const userId = req.params.userId;
            if (!userId) {
                res.status(400).json({ success: false, message: "User ID is required!" });
                return;
            }

            await AuthService.changePassword(userId, password, UserRole.RECRUITER);
            res.status(200).json({ success: true, message: "Password reset successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, error: "Internal server error!" });
        }
    },

    getCompanyInfo: async (req: Request, res: Response): Promise<void> => {
        try {
            const recruiterId = req.params.recruiterId;

            // Validate recruiterId
            const { error } = recruiterIdValidationSchema.validate({ recruiterId });
            if (error) {
                res.status(400).json({ message: 'Invalid recruiter ID format' });
                return;
            }

            // Fetch recruiter from database
            const result = await RecruiterService.getRecruiterById(recruiterId);

            // Check if recruiter exists
            if (!result) {
                res.status(404).json({ message: 'Recruiter not found' });
                return;
            }

            // Send company info response
            res.status(200).json({ success: true, result });

        } catch (err) {
            console.error('Error fetching company info:', err);
            res.status(500).json({ message: 'Internal server error' });
        }

    }

};

export default RecruiterController;
