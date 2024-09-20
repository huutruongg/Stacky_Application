import { Response, Request, NextFunction } from "express";
import sendEmail from "../services/email.service";

const EmailController = {
    sendEmail: async (req: Request, res: Response): Promise<void> => {
        try {
            const { to, subject, text } = req.body;
            // Validate input data (optional)
            if (!to || !subject || !text) {
                res.status(400).json({ message: "Missing required fields: 'to', 'subject', and 'text'." });
            }
            const sent: boolean = await sendEmail(to, subject, text);

            if (sent) {
                res.status(200).json({ message: "Sent successfully!" });
            } else {
                res.status(400).json({ message: "Failed to send email." });
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error sending email:", error);
            // Send error response
            res.status(500).json({ message: "An error occurred while sending the email." });
        }
    }
};

export default EmailController;
