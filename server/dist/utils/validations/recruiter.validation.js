"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recruiterIdValidationSchema = void 0;
// recruiter.validation.ts
const joi_1 = __importDefault(require("joi"));
exports.recruiterIdValidationSchema = joi_1.default.object({
    recruiterId: joi_1.default.string().length(24).required(),
});
