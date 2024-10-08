"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Candidate schemas
exports.CandidateValidation = {
    candidateIdSchema: joi_1.default.object({
        candidateId: joi_1.default.string().required(),
    }),
    jobIdSchema: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
    candidateProfessionalDetailsSchema: joi_1.default.object({
        candidateId: joi_1.default.string().required(),
        fullName: joi_1.default.string().required(),
        jobPosition: joi_1.default.string().required(),
        publicEmail: joi_1.default.string().email().required(),
        phoneNumber: joi_1.default.string().required(),
        gender: joi_1.default.boolean().required(),
        birthDate: joi_1.default.date().required(),
        avatarUrl: joi_1.default.string().uri().optional(),
        address: joi_1.default.string().required(),
        linkedinUrl: joi_1.default.string().uri().optional(),
        githubUrl: joi_1.default.string().uri().optional(),
        personalDescription: joi_1.default.string().optional(),
        languages: joi_1.default.array().items(joi_1.default.object({
            language: joi_1.default.string().required(),
            level: joi_1.default.string().required()
        })).required(),
        projects: joi_1.default.array().items(joi_1.default.object({
            projectName: joi_1.default.string().required(),
            projectTime: joi_1.default.string().required(),
            urlRepo: joi_1.default.string().uri().optional(),
            projectDescription: joi_1.default.string().optional()
        })).required(),
        certifications: joi_1.default.array().items(joi_1.default.object({
            certificateName: joi_1.default.string().required(),
            dateOfReceipt: joi_1.default.date().required(),
            certificateDetail: joi_1.default.string().required()
        })).required(),
        programmingSkills: joi_1.default.string().required(),
        educations: joi_1.default.array().items(joi_1.default.object({
            schoolName: joi_1.default.string().required(),
            startDate: joi_1.default.date().required(),
            finishDate: joi_1.default.date().required(),
            fieldName: joi_1.default.string().required()
        })).required(),
        experiences: joi_1.default.array().items(joi_1.default.object({
            companyName: joi_1.default.string().required(),
            startDate: joi_1.default.date().required(),
            endDate: joi_1.default.date().optional(),
            jobPosition: joi_1.default.string().required(),
            previousJobDetails: joi_1.default.string().required()
        })).required(),
    })
};
