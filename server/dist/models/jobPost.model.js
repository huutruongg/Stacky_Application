"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPost = void 0;
const mongoose_1 = require("mongoose");
const LanguageSchema = new mongoose_1.Schema({
    language: { type: String, required: true },
    level: { type: String, required: true }
});
const JobPostSchema = new mongoose_1.Schema({
    recruiterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    jobTitle: { type: String, required: true },
    jobImage: { type: String, required: true },
    typeOfWork: { type: String, required: true },
    location: { type: String, required: true },
    jobSalary: { type: String, required: true },
    candidatesLimit: { type: Number, required: true },
    educationRequired: { type: String, required: true },
    yearsOfExperience: { type: String, required: true },
    typeOfIndustry: { type: String, required: true },
    professionalSkills: { type: String, required: true },
    certificateRequired: { type: String, required: true },
    languagesRequired: [LanguageSchema],
    jobBenefit: { type: String, required: true },
    leavePolicy: { type: String, required: true },
    jobDescription: { type: String, required: true },
    workEnvironment: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    jobSchedule: { type: String, required: true },
    postStatus: { type: String, required: true },
    postedAt: { type: Date, required: true }
});
exports.JobPost = (0, mongoose_1.model)('JobPost', JobPostSchema);
