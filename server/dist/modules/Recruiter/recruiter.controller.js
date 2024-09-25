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
const recruiter_service_1 = __importDefault(require("./recruiter.service"));
const email_service_1 = __importDefault(require("../Email/email.service"));
const console_1 = require("console");
const resetPasswordTemplate_1 = require("../../views/resetPasswordTemplate");
const RecruiterController = {
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield recruiter_service_1.default.getRecruiterByEmail(email);
            if (!user) {
                res.status(401).json({ success: false, message: "Email not found!" });
                return;
            }
            const companyName = user.org_name || "you";
            const url = `http://localhost:4080/recruiter/reset-password/${user.recruiter_id}`;
            const htmlContent = (0, resetPasswordTemplate_1.resetPasswordTemplate)(companyName, url);
            yield (0, email_service_1.default)(email, "Reset your password!", "", htmlContent);
            res.status(200).json({ success: true, message: "Password reset email sent successfully!" });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            const userId = req.params.id;
            if (!password || !userId) {
                res.status(401).json({ success: false, message: "Something went wrong!" });
                return;
            }
            yield recruiter_service_1.default.changePassword(userId, password);
            res.status(200).json({ success: true, message: "Password reset successfully!" });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    })
};
exports.default = RecruiterController;
