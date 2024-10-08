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
const console_1 = require("console");
const resetPasswordTemplate_1 = require("../../views/resetPasswordTemplate");
const email_service_1 = __importDefault(require("../Email/email.service"));
const auth_service_1 = __importDefault(require("../Auth/auth.service"));
const EnumUserRole_1 = __importDefault(require("../../types/EnumUserRole"));
const handleError_1 = require("../../utils/errors/handleError");
const recruiter_validate_1 = require("../../utils/validations/recruiter.validate");
const recruiter_validation_1 = require("../../utils/validations/recruiter.validation");
const RecruiterController = {
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate the request body
            const { error } = recruiter_validate_1.RecruiterValidation.forgotPasswordSchema.validate(req.body);
            if ((0, handleError_1.handleValidationError)(error, res))
                return;
            const { privateEmail } = req.body;
            const data = yield recruiter_service_1.default.getRecruiterByEmail(privateEmail);
            if (!data) {
                res.status(404).json({ success: false, message: "Email not found!" });
                return;
            }
            const companyName = data.orgName || "you";
            const url = `http://localhost:4080/recruiter/reset-password/${data._id}`;
            const htmlContent = (0, resetPasswordTemplate_1.resetPasswordTemplate)(companyName, url);
            yield email_service_1.default.sendEmail(privateEmail, "Reset your password!", "", htmlContent);
            res.status(200).json({ success: true, message: "Password reset email sent successfully!" });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, error: "Internal server error!" });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate the request body
            const { error } = recruiter_validate_1.RecruiterValidation.resetPasswordSchema.validate(req.body);
            if ((0, handleError_1.handleValidationError)(error, res))
                return;
            const { password } = req.body;
            const userId = req.params.id;
            if (!userId) {
                res.status(400).json({ success: false, message: "User ID is required!" });
                return;
            }
            yield auth_service_1.default.changePassword(userId, password, EnumUserRole_1.default.RECRUITER);
            res.status(200).json({ success: true, message: "Password reset successfully!" });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, error: "Internal server error!" });
        }
    }),
    getCompanyInfo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const recruiterId = req.params.recruiterId;
            // Validate recruiterId
            const { error } = recruiter_validation_1.recruiterIdValidationSchema.validate({ recruiterId });
            if (error) {
                res.status(400).json({ message: 'Invalid recruiter ID format' });
                return;
            }
            // Fetch recruiter from database
            const result = yield recruiter_service_1.default.getRecruiterById(recruiterId);
            // Check if recruiter exists
            if (!result) {
                res.status(404).json({ message: 'Recruiter not found' });
                return;
            }
            // Send company info response
            res.status(200).json({ success: true, result });
        }
        catch (err) {
            console.error('Error fetching company info:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
};
exports.default = RecruiterController;
