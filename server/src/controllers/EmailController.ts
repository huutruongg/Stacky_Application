import { Request, Response } from 'express';
import { log } from 'console';
import { BaseController } from './BaseController'; 
import { EmailService } from '../services/EmailService';

export default class EmailController extends BaseController {
    private emailService: EmailService;

    constructor() {
        super();
        this.emailService = new EmailService();
    }

    public sendEmail = async (req: Request, res: Response): Promise<void> => {
        const { to, subject, text } = req.body;

        if (!to || !subject || !text) {
            return this.sendError(res, 400, "Missing required fields: 'to', 'subject', and 'text'.");
        }

        try {
            const sent = await this.emailService.sendEmail(to, subject, text);

            if (sent) {
                return this.sendResponse(res, 200, { success: true, message: "Sent successfully!" });
            } else {
                return this.sendError(res, 500, "Failed to send email.");
            }
        } catch (error) {
            log("Error sending email:", error);
            return this.sendError(res, 500, "An error occurred while sending the email.");
        }
    }

    public sendEmailToCandidates = async (req: Request, res: Response): Promise<void> => {
        const { emails, jobPostId, subject, text } = req.body;

        if (!emails || !jobPostId || !subject || !text) {
            return this.sendError(res, 400, "Missing required fields: 'emails', 'jobPostId', 'subject', and 'text'.");
        }

        try {
            await this.emailService.filterAndSendEmails(emails, jobPostId, subject, text);

            return this.sendResponse(res, 200, { success: true, message: "Emails sent successfully!" });
        } catch (error) {
            log("Error sending emails:", error);
            return this.sendError(res, 500, "An error occurred while sending the emails.");
        }
    }
}
