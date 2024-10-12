import { Schema, model } from 'mongoose';
import { IJobPost } from '../types/IJobPost';

const LanguageSchema = new Schema({
  language: { type: String, required: true },
  level: { type: String, required: true }
});

const JobPostSchema = new Schema({
  recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
  postStatus: { type: String, required: true },
  postedAt: { type: Date, required: true }
});

export const JobPost = model<IJobPost>('JobPost', JobPostSchema);
