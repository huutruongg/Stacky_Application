import { Document } from 'mongoose';
import { IUser } from './IUser';
import { IJobPost } from './IJobPost';

export interface IOAuthToken {
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken?: string;
}

export interface IProject {
  projectName: string;
  projectTime: string;
  urlRepo: string;
  projectDescription?: string;
}

export interface IEducation {
  schoolName: string;
  startDate: Date;
  finishDate: Date;
  fieldName: string;
}

export interface IExperience {
  companyName: string;
  startDate: Date;
  endDate: Date;
  jobPosition: string;
  previousJobDetails: string;
}

export interface ICertification {
  certificateName: string;
  dateOfReceipt: Date;
  certificateDetail: string;
}

export interface ILanguage {
  language: string;
  level: string;
}

export interface IJobSaved {
  jobPostId: IJobPost['_id'];
  savedAt: Date;
}

export interface IJobApplied {
  jobPostId: IJobPost['_id'];
  status: ApplyStatus;
  githubScore: number;
  appliedAt: Date;
}

export interface ICandidate extends Document {
  userId: IUser['_id'];
  publicEmail: string;
  phoneNumber?: string;
  createdAt: Date;
  programmingSkills: string;
  fullName: string;
  gender: boolean;
  birthDate: Date;
  avatarUrl: string;
  address: string;
  linkedinUrl: string;
  githubUrl: string;
  personalDescription: string;
  jobPosition: string;
  oauthTokens: IOAuthToken[];
  languages: ILanguage[];
  projects: IProject[];
  educations: IEducation[];
  experiences: IExperience[];
  certifications: ICertification[];
  jobSaved: IJobSaved[];
  jobApplied: IJobApplied[];
}
