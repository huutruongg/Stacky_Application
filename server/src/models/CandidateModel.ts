import mongoose, { Schema, Document } from "mongoose";
import { ICandidate } from "../interfaces/ICandidate";
import { ApplyStatus } from "../enums/EApplySatus";

// Define the schema for OAuthTokenSchema
const OAuthTokenSchema: Schema = new Schema({
  provider: { type: String, required: true },
  accessToken: { type: String, required: true },
});

// Define the schema for LanguageSchema
export const LanguageSchema: Schema = new Schema({
  language: { type: String, required: true },
  level: { type: String, required: true },
});

// Define the schema for ProjectSchema
export const ProjectSchema: Schema = new Schema({
  projectName: { type: String, required: true },
  projectTime: { type: String, required: true },
  urlRepo: { type: String },
  projectDescription: { type: String },
});

// Define the schema for EducationSchema
export const EducationSchema: Schema = new Schema({
  schoolName: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
  fieldName: { type: String, required: true },
});

// Define the schema for ExperienceSchema
export const ExperienceSchema: Schema = new Schema({
  companyName: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  jobPosition: { type: String },
  previousJobDetails: { type: String },
});

// Define the schema for CertificationSchema
export const CertificationSchema: Schema = new Schema({
  certificateName: { type: String, required: true },
  dateOfReceipt: { type: Date, required: true },
  certificateDetail: { type: String, required: true },
});

// Define the schema for JobSavedSchema
const JobSavedSchema = new Schema({
  jobPostId: { type: Schema.Types.ObjectId, ref: "JobPost", required: true },
  savedAt: { type: Date, default: Date.now() },
});

// Define the schema for JobAppliedSchema
const JobAppliedSchema = new Schema({
  jobPostId: { type: Schema.Types.ObjectId, ref: "JobPost", required: true },
  status: { type: String, default: ApplyStatus.PENDING },
  // githubScore: { type: Number, default: 0 },
  appliedAt: { type: Date, default: Date.now() },
});

// Define the schema for CandidateSchema
const CandidateSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  publicEmail: { type: String },
  phoneNumber: { type: String },
  professionalSkills: { type: String },
  fullName: { type: String },
  gender: { type: String },
  birthDate: { type: Date },
  avatarUrl: { type: String },
  address: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  personalDescription: { type: String },
  jobPosition: { type: String },
  oauthToken: OAuthTokenSchema,
  languages: [LanguageSchema],
  projects: [ProjectSchema],
  educations: [EducationSchema],
  experiences: [ExperienceSchema],
  certifications: [CertificationSchema],
  jobSaved: [JobSavedSchema],
  jobApplied: [JobAppliedSchema],
});

// Create and export the CandidateModel
const CandidateModel = mongoose.model<ICandidate>("Candidate", CandidateSchema);
export default CandidateModel;
