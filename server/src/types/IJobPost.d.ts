import { Document, Types } from 'mongoose';
import { ILanguage } from './ICandidate';
import { IUser } from './IUser';

export interface IApplicant {
  userId: IUser['_id'];
  programmingSkills?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  personalDescription?: string;
  languages: ILanguage[];
  projects: IProject[];
  educations: IEducation[];
  experiences: IExperience[];
  certifications: ICertification[];
  status: ApplyStatus;
  githubScore: number;
  appliedAt: Date;
}

export interface IJobPost extends Document {
  userId: IUser['_id'];
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
  postStatus: PostStatus;
  postedAt: Date;
  applicants: IApplicant[];
}