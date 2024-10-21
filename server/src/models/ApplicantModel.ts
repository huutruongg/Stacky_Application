import mongoose, { Schema } from "mongoose";
import { CertificationSchema, EducationSchema, ExperienceSchema, LanguageSchema, ProjectSchema } from "./CandidateModel";
import { ApplyStatus } from "../enums/EApplySatus";
import { IApplicant } from "../interfaces/ICandidate";

const ApplicantSchema = new Schema({
    jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    programmingSkills: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    personalDescription: { type: String },
    languages: [LanguageSchema],
    projects: [ProjectSchema],
    educations: [EducationSchema],
    experiences: [ExperienceSchema],
    certifications: [CertificationSchema],
    status: { type: String, enum: Object.values(ApplyStatus), default: ApplyStatus.PENDING },
    githubScore: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
});
  
const ApplicantModel = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
export default ApplicantModel;