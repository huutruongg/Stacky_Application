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
    } as SMTPTransport.Options);
  }

  public sendEmail = async (to: string | string[], subject: string, text: string, html: string = ""): Promise<boolean> => {
    log("Sending email to:", to);
    log("Subject:", subject);
    log("Text:", text);

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
  };

  public sendEmailToCandidates = async (
    emails: string[],
    jobPostId: string,
    subject: string,
    text: string,
    html: string = ""
  ) => {
    const candidates = await ApplicantModel.find({
      publicEmail: { $in: emails },
      jobPostId: new Types.ObjectId(jobPostId),
    });
    log("Candidates found:", candidates);
    for (const candidate of candidates) {
      if (!candidate.publicEmail) {
        console.log(`No public email found for ${candidate.publicEmail}`);
        continue;
      }
      const emailSent = await this.sendEmail(candidate.publicEmail, subject, text, html);

      if (emailSent) {
        candidate.isSent = true;
        candidate.jobPostId = jobPostId;
        await candidate.save();
        console.log(`Email sent successfully to ${candidate.publicEmail} for job post ${jobPostId}`);
      } else {
        console.log(`Failed to send email to ${candidate.publicEmail} for job post ${jobPostId}`);
      }
    }
  };
}

export default new EmailService();
