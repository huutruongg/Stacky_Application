import { Schema, model } from 'mongoose';
import { ICandidate } from '../src/types/ICandidate';

const OAuthTokenSchema = new Schema({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String }
});

const LanguageSchema = new Schema({
  language: { type: String, required: true },
  level: { type: String, required: true }
});

const ProjectSchema = new Schema({
  projectName: { type: String, required: true },
  projectTime: { type: String, required: true },
  urlRepo: { type: String },
  projectDescription: { type: String }
});

const EducationSchema = new Schema({
  schoolName: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
  fieldName: { type: String, required: true }
});

const ExperienceSchema = new Schema({
  companyName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  jobPosition: { type: String, required: true },
  previousJobDetails: { type: String, required: true }
});

const CertificationSchema = new Schema({
  certificateName: { type: String, required: true },
  dateOfReceipt: { type: Date, required: true },
  certificateDetail: { type: String, required: true }
});

const CandidateSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

export const Candidate = model<ICandidate>('Candidate', CandidateSchema);
