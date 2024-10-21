import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

export class EmailService {
    private transporter;

    constructor() {
        // Thiết lập transporter trong constructor
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    
    async sendEmail(to: string, subject: string, text: string, html: string = ""): Promise<boolean> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_ADDRESS, // Email gửi đi
                to,
                subject,
                text,
                html,
            });
            log("Email sent successfully to:", to);
            return true;
        } catch (error) {
            log("Error sending email:", error);
            return false;
        }
    }
}

export default new EmailService();
