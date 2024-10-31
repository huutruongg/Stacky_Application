import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { log } from "console";
import dns from "dns";
import SMTPTransport from "nodemailer/lib/smtp-transport";
dotenv.config();

const dnsCache = new Map();
dns.setDefaultResultOrder("ipv4first");

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
            pool: true,
            dnsCache,
        } as SMTPTransport.Options); // Use type assertion
    }

    async sendEmail(to: string, subject: string, text: string, html: string = ""): Promise<boolean> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_ADDRESS,
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
