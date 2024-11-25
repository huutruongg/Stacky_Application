import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { log } from "console";
import dns from "dns";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import ApplicantModel from "../models/ApplicantModel";
import { Types } from "mongoose";
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

    async sendEmail(to: string | string[], subject: string, text: string, html: string = ""): Promise<boolean> {
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

    async filterAndSendEmails(
        emails: string[],
        jobPostId: string,
        subject: string,
        text: string,
        html: string = ""
      ) {
        // Truy vấn ứng viên theo email và jobPostId
        const candidates = await ApplicantModel.find({
          publicEmail: { $in: emails },
          jobPostId: new Types.ObjectId(jobPostId),
        });
      
        // Lọc danh sách ứng viên chưa được gửi email
        const candidatesToSend = candidates.filter(candidate => !candidate.isSent);
      
        if (candidatesToSend.length === 0) {
          console.log("All selected candidates have already received emails for this job post.");
          return;
        }
      
        // Gửi email từng ứng viên và đánh dấu trạng thái đã gửi
        for (const candidate of candidatesToSend) {
            if (!candidate.publicEmail) {
                console.log(`No public email found for ${candidate.publicEmail}`);
                continue;
            }
          const emailSent = await this.sendEmail(candidate.publicEmail, subject, text, html);
      
          if (emailSent) {
            candidate.isSent = true; // Đánh dấu trạng thái đã gửi
            candidate.jobPostId = jobPostId; // Đảm bảo liên kết với JobPostId
            await candidate.save(); // Cập nhật vào DB ngay lập tức
            console.log(`Email sent successfully to ${candidate.publicEmail} for job post ${jobPostId}`);
          } else {
            console.log(`Failed to send email to ${candidate.publicEmail} for job post ${jobPostId}`);
          }
        }
      }
      
}

export default new EmailService();
