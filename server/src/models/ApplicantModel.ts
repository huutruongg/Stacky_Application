import mongoose, { Schema } from "mongoose";
import { CertificationSchema, EducationSchema, ExperienceSchema, LanguageSchema, ProjectSchema } from "./CandidateModel";
import { IApplicant } from "../interfaces/ICandidate";

const ApplicantSchema = new Schema({
    jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    publicEmail: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    birthDate: { type: Date },
    phoneNumber: { type: String },
    address: { type: String },
    professionalSkills: { type: String, required: true },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    personalDescription: { type: String },
    languages: [LanguageSchema],
    projects: [ProjectSchema],
    educations: [EducationSchema],
    experiences: [ExperienceSchema],
    certifications: [CertificationSchema],
    githubScore: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
});

const ApplicantModel = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
export default ApplicantModel;