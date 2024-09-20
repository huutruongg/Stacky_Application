import { log } from "console";
require('dotenv').config();
const nodemailer = require("nodemailer");

const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: to,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
        return true;
    } catch (error) {
        console.log(error, "email not sent");
        return false;
    }
};

export default sendEmail;