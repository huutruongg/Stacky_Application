import { Document, Types } from 'mongoose';
import { ILanguage } from './ICandidate';

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
  languagesRequired: ILanguage[];
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