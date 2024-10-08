"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AuthValidation = {
    signupRecruiterSchema: joi_1.default.object({
        privateEmail: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        phoneNumber: joi_1.default.string().required(),
        orgTaxNumber: joi_1.default.string().required(),
        orgName: joi_1.default.string().required(),
        orgField: joi_1.default.string().required(),
        orgScale: joi_1.default.string().required(),
        orgAddress: joi_1.default.string().required()
    }),
    loginSchema: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    })
};
