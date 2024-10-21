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

    public async sendEmail(req: Request, res: Response): Promise<void> {
        const { to, subject, text } = req.body;

        if (!to || !subject || !text) {
            this.sendError(res, 400, "Missing required fields: 'to', 'subject', and 'text'.");
            return;
        }

        try {
            const sent = await this.emailService.sendEmail(to, subject, text);

            if (sent) {
                this.sendResponse(res, 200, { success: true, message: "Sent successfully!" });
            } else {
                this.sendError(res, 500, "Failed to send email.");
            }
        } catch (error) {
            log("Error sending email:", error);
            this.sendError(res, 500, "An error occurred while sending the email.");
        }
    }
}
