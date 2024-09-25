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
const email_service_1 = __importDefault(require("./email.service"));
const EmailController = {
    sendEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { to, subject, text } = req.body;
        // Validate input data
        if (!to || !subject || !text) {
            res.status(400).json({ success: false, message: "Missing required fields: 'to', 'subject', and 'text'." });
            return;
        }
        try {
            const sent = yield (0, email_service_1.default)(to, subject, text);
            if (sent) {
                res.status(200).json({ success: true, message: "Sent successfully!" });
                return;
            }
            else {
                res.status(400).json({ success: false, message: "Failed to send email." });
                return;
            }
        }
        catch (error) {
            // Log the error for debugging
            console.error("Error sending email:", error);
            // Send error response
            res.status(500).json({ success: false, message: "An error occurred while sending the email." });
            return;
        }
    })
};
exports.default = EmailController;
