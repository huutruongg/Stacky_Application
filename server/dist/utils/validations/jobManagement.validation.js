"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const EnumPostStatus_1 = __importDefault(require("../../types/EnumPostStatus"));
const EnumApplicationStatus_1 = __importDefault(require("../../types/EnumApplicationStatus"));
const JobManagementValidate = {
    pageSchema: () => {
        return joi_1.default.object({
            page: joi_1.default.number().integer().min(1).required(),
            pageSize: joi_1.default.number().integer().min(1).required()
        });
    },
    recruiterIdPostIdSchema: () => {
        return joi_1.default.object({
            recruiterId: joi_1.default.string().required(),
            postId: joi_1.default.string().optional()
        });
    },
    candidateIdSchema: () => {
        return joi_1.default.object({
            candidateId: joi_1.default.string().required()
        });
    },
    jobPostIdSchema: () => {
        return joi_1.default.object({
            jobPostId: joi_1.default.string().required()
        });
    },
    jobSavedIdSchema: () => {
        return joi_1.default.object({
            jobSavedId: joi_1.default.string().required()
        });
    },
    findByJobPositionSchema: () => {
        return joi_1.default.object({
            keySearch: joi_1.default.string().required()
        });
    },
    filterByLocationSchema: () => {
        return joi_1.default.object({
            locationSelection: joi_1.default.string().required()
        });
    },
    filterByIndustrySchema: () => {
        return joi_1.default.object({
            industrySelection: joi_1.default.string().required()
        });
    },
    createJobPostingSchema: () => {
        return joi_1.default.object({
            recruiterId: joi_1.default.string().required(),
            jobTitle: joi_1.default.string().required(),
            jobImage: joi_1.default.string().uri().optional(),
            typeOfWork: joi_1.default.string().required(),
            location: joi_1.default.string().required(),
            jobSalary: joi_1.default.string().required(),
            candidatesLimit: joi_1.default.number().required(),
            educationRequired: joi_1.default.string().required(),
            yearsOfExperience: joi_1.default.string().required(),
            typeOfIndustry: joi_1.default.string().required(),
            professionalSkills: joi_1.default.string().required(),
            certificateRequired: joi_1.default.string().optional(),
            languagesRequired: joi_1.default.array().items(joi_1.default.object({
                language: joi_1.default.string().required(),
                level: joi_1.default.string().required()
            })).optional(),
            jobBenefit: joi_1.default.string().optional(),
            leavePolicy: joi_1.default.string().optional(),
            jobDescription: joi_1.default.string().required(),
            workEnvironment: joi_1.default.string().optional(),
            jobSchedule: joi_1.default.string().optional(),
            applicationDeadline: joi_1.default.date().required()
        });
    },
    ApplyStatusSchema: () => {
        return joi_1.default.object({
            applicationId: joi_1.default.string().required(),
            status: joi_1.default.string().valid(...Object.values(EnumApplicationStatus_1.default)).required()
        });
    },
    JobPostStatusSchema: () => {
        return joi_1.default.object({
            jobPostId: joi_1.default.string().required(),
            postStatus: joi_1.default.string().valid(...Object.values(EnumPostStatus_1.default)).required()
        });
    }
};
exports.default = JobManagementValidate;
