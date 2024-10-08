"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candidate = void 0;
const mongoose_1 = require("mongoose");
const OAuthTokenSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String }
});
const LanguageSchema = new mongoose_1.Schema({
    language: { type: String, required: true },
    level: { type: String, required: true }
});
const ProjectSchema = new mongoose_1.Schema({
    projectName: { type: String, required: true },
    projectTime: { type: String, required: true },
    urlRepo: { type: String },
    projectDescription: { type: String }
});
const EducationSchema = new mongoose_1.Schema({
    schoolName: { type: String, required: true },
    startDate: { type: Date, required: true },
    finishDate: { type: Date, required: true },
    fieldName: { type: String, required: true }
});
const ExperienceSchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    jobPosition: { type: String, required: true },
    previousJobDetails: { type: String, required: true }
});
const CertificationSchema = new mongoose_1.Schema({
    certificateName: { type: String, required: true },
    dateOfReceipt: { type: Date, required: true },
    certificateDetail: { type: String, required: true }
});
const CandidateSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    publicEmail: { type: String },
    programmingSkills: { type: String },
    fullName: { type: String },
    gender: { type: Boolean },
    birthDate: { type: Date },
    avatarUrl: { type: String },
    address: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    personalDescription: { type: String },
    jobPosition: { type: String },
    oauthTokens: [OAuthTokenSchema],
    languages: [LanguageSchema],
    projects: [ProjectSchema],
    educations: [EducationSchema],
    experiences: [ExperienceSchema],
    certifications: [CertificationSchema]
});
exports.Candidate = (0, mongoose_1.model)('Candidate', CandidateSchema);
