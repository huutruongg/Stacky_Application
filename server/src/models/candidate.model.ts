import { Schema, model } from 'mongoose';
import { ICandidate } from '../types/ICandidate';
import ApplyStatus from '../types/EnumApplicationStatus';

const OAuthTokenSchema = new Schema({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String }
});

export const LanguageSchema = new Schema({
  language: { type: String, required: true },
  level: { type: String, required: true }
});

export const ProjectSchema = new Schema({
  projectName: { type: String, required: true },
  projectTime: { type: String, required: true },
  urlRepo: { type: String },
  projectDescription: { type: String }
});

export const EducationSchema = new Schema({
  schoolName: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
  fieldName: { type: String, required: true }
});

export const ExperienceSchema = new Schema({
  companyName: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  jobPosition: { type: String },
  previousJobDetails: { type: String }
});

export const CertificationSchema = new Schema({
  certificateName: { type: String },
  dateOfReceipt: { type: Date, required: true },
  certificateDetail: { type: String, required: true }
});

const JobSavedSchema = new Schema({
  jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
  savedAt: { type: Date, default: Date.now() }
});

const JobAppliedSchema = new Schema({
  jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
  status: { type: String, default: ApplyStatus.PENDING },
  githubScore: { type: Number, default: 0 },
  appliedAt: { type: Date, default: Date.now() }
});

const CandidateSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publicEmail: { type: String },
  phoneNumber: { type: String },
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
  certifications: [CertificationSchema],
  jobSaved: [JobSavedSchema],
  jobApplied: [JobAppliedSchema]
});



export const Candidate = model<ICandidate>('Candidate', CandidateSchema);
