import { Response, Request } from "express";
import { log } from "console";
import EmailService from "./email.service";

const EmailController = {
    sendEmail: async (req: Request, res: Response): Promise<void> => {
        const { to, subject, text } = req.body;

        // Validate input data
        if (!to || !subject || !text) {
            res.status(500).json({ success: false, message: "Missing required fields: 'to', 'subject', and 'text'." });
            return;
        }

        try {
            const sent: boolean | null = await EmailService.sendEmail(to, subject, text);

            if (sent) {
                res.status(200).json({ success: true, message: "Sent successfully!" });
                return;
            } else {
                res.status(500).json({ success: false, message: "Failed to send email." });
                return;
            }
        } catch (error) {
            // Log the error for debugging
            log("Error sending email:", error);
            // Send error response
            res.status(500).json({ success: false, message: "An error occurred while sending the email." });
        }
    }
};

export default EmailController;
