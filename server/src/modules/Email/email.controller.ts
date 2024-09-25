import { Response, Request } from "express";
import sendEmail from "./email.service";

const EmailController = {
    sendEmail: async (req: Request, res: Response): Promise<void> => {
        const { to, subject, text } = req.body;

        // Validate input data
        if (!to || !subject || !text) {
            res.status(400).json({ success: false, message: "Missing required fields: 'to', 'subject', and 'text'." });
            return;
        }

        try {
            const sent: boolean = await sendEmail(to, subject, text);

            if (sent) {
                res.status(200).json({ success: true, message: "Sent successfully!" });
                return;
            } else {
                res.status(400).json({ success: false, message: "Failed to send email." });
                return;
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error sending email:", error);
            // Send error response
            res.status(500).json({ success: false, message: "An error occurred while sending the email." });
            return;
        }
    }
};

export default EmailController;
