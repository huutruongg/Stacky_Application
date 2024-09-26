import { log } from "console";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const EmailService = {
    sendEmail: async (to: string, subject: string, text: string, html: string = ""): Promise<boolean | null> => {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        try {
            await transporter.sendMail({
                from: process.env.USER,
                to,
                subject,
                text,
                html
            });
            log("Email sent successfully to:", to);
            return true;
        } catch (error) {
            log("Error sending email:", error);
            return false;
        }
    }
}

export default EmailService;
