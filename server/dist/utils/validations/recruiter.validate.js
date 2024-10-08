"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruiterValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.RecruiterValidation = {
    forgotPasswordSchema: joi_1.default.object({
        privateEmail: joi_1.default.string().email().required()
    }),
    resetPasswordSchema: joi_1.default.object({
        password: joi_1.default.string().min(6).required()
    }),
    updateCompanyContactSchema: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        mobile: joi_1.default.string().pattern(/^[0-9]+$/).min(10).max(15).required()
    }),
    updateCompanyProfileSchema: joi_1.default.object({
        // Add fields needed for company profile update, with validation rules
        orgName: joi_1.default.string().required(),
        orgField: joi_1.default.string().required(),
        orgScale: joi_1.default.string().required(),
        orgAddress: joi_1.default.string().required(),
        // Other fields related to company profile
    })
};
