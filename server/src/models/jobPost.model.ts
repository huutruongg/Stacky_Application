import { Schema, model } from 'mongoose';
import { IJobPost } from '../types/IJobPost';
import ApplyStatus from '../types/EnumApplicationStatus';
import { CertificationSchema, EducationSchema, ExperienceSchema, ProjectSchema } from './candidate.model';
import PostStatus from '../types/EnumPostStatus';

const LanguageSchema = new Schema({
  language: { type: String, required: true },
  level: { type: String, required: true }
});

const ApplicantSchema = new Schema({
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

const JobPostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
  staffLevel: { type: String, required: true },
  genderRequired: { type: String, required: true },
  postStatus: { type: String, enum: Object.values(PostStatus), default: PostStatus.PENDING },
  applicants: [ApplicantSchema],
  postedAt: { type: Date, default: Date.now }
});

export const JobPost = model<IJobPost>('JobPost', JobPostSchema);
