import { Document } from 'mongoose';

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

export interface ICandidate extends Document {
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  programmingSkills: string;
  fullName: string;
  gender: boolean;
  birthDate: Date;
  avatarUrl: String;
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
  certificates: ICertification[];
}
