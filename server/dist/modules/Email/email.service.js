"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EmailService = {
    sendEmail: (to_1, subject_1, text_1, ...args_1) => __awaiter(void 0, [to_1, subject_1, text_1, ...args_1], void 0, function* (to, subject, text, html = "") {
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        try {
            yield transporter.sendMail({
                from: process.env.USER,
                to,
                subject,
                text,
                html
            });
            (0, console_1.log)("Email sent successfully to:", to);
            return true;
        }
        catch (error) {
            (0, console_1.log)("Error sending email:", error);
            return false;
        }
    })
};
exports.default = EmailService;
