import mongoose, { Schema } from 'mongoose';
import { IJobPost } from '../interfaces/IJobPost';
import { PostStatus } from '../enums/EPostStatus';
import { CertificationSchema, EducationSchema, ExperienceSchema, LanguageSchema, ProjectSchema } from './CandidateModel';
import { ApplyStatus } from '../enums/EApplySatus';
import ApplicantSchema from './ApplicantModel';


// Define the schema for the JobPostModel
const JobPostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  orgName: { type: String, required: true },
  jobImage: { type: String },
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
  leavePolicy: { type: String },
  jobDescription: { type: String, required: true },
  workEnvironment: { type: String },
  applicationDeadline: { type: Date, required: true },
  jobSchedule: { type: String, required: true },
  staffLevel: { type: String, required: true },
  genderRequired: { type: String, required: true },
  postedAt: { type: Date, default: Date.now }
});

// Create and export the JobPostModel
const JobPostModel = mongoose.model<IJobPost>('JobPost', JobPostSchema);
export default JobPostModel;

//  Get ra danh sách của các ứng viên trong 1 bài đăng tuyển dụng:
// Need: userId + jobPostId => 