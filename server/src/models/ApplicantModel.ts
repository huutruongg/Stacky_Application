import mongoose, { Schema } from "mongoose";
import { CertificationSchema, EducationSchema, ExperienceSchema, LanguageSchema, ProjectSchema } from "./CandidateModel";
import { IApplicant } from "../interfaces/ICandidate";
import { ApplyStatus } from "../enums/EApplySatus";

const ApplicantSchema = new Schema({
    jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String },
    publicEmail: { type: String },
    jobPosition: { type: String },
    avatarUrl: { type: String },
    birthDate: { type: Date },
    phoneNumber: { type: String },
    address: { type: String },
    professionalSkills: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    personalDescription: { type: String },
    languages: [LanguageSchema],
    projects: [ProjectSchema],
    educations: [EducationSchema],
    experiences: [ExperienceSchema],
    certifications: [CertificationSchema],
    aiAnalysistScore: {
        professionalSkills: { type: Number, default: 0 },
        educations: { type: Number, default: 0 },
        languages: { type: Number, default: 0 },
        certifications: { type: Number, default: 0 },
    },
    githubScore: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
    isSent: { type: Boolean, default: false },
    status: { type: String, default: ApplyStatus.PENDING }
});

const ApplicantModel = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
export default ApplicantModel;