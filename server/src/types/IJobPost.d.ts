import { ILanguage } from './ICandidate.d';
import { Document, Types } from 'mongoose';

export interface IJobPost extends Document {
  recruiterId: Types.ObjectId;
  jobTitle: string;
  jobImage: string;
  typeOfWork: string;
  location: string;
  jobSalary: string;
  candidatesLimit: number;
  educationRequired: string;
  yearsOfExperience: string;
  typeOfIndustry: string;
  professionalSkills: string;
  certificateRequired: string;
  languagesRequired: string;
  jobBenefit: string;
  leavePolicy: string;
  jobDescription: string;
  workEnvironment: string;
  jobSchedule: string;
  applicationDeadline: Date;
  staffLevel: string;
  genderRequired: string
  postStatus: string;
  postedAt: Date;
}

export interface ILanguage extends Document { language: string; level: string }