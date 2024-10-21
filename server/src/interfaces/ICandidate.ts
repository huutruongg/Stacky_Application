import { Document } from "mongoose";
import { ICertification } from "./ICertification";
import { IEducation } from "./IEducation";
import { IExperience } from "./IExperience";
import { ILanguage } from "./ILanguage";
import { IOAuthToken } from "./IOauthToken";
import { IProject } from "./IProject";
import { IUser } from "./IUser";
import { ApplyStatus } from "../enums/EApplySatus";
import { IJobApplied, IJobPost, IJobSaved } from "./IJobPost";

export interface ICandidate extends Document {
    userId: IUser['_id'];
    publicEmail?: string;
    phoneNumber?: string;
    programmingSkills?: string;
    fullName?: string;
    gender?: boolean;
    birthDate?: Date;
    avatarUrl?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    personalDescription?: string;
    jobPosition?: string;
    oauthTokens?: IOAuthToken[];
    languages?: ILanguage[];
    projects?: IProject[];
    educations?: IEducation[];
    experiences?: IExperience[];
    certifications?: ICertification[];
    jobSaved?: IJobSaved[];
    jobApplied?: IJobApplied[];
}

export interface IApplicant extends Document {
    jobPostId: IJobPost['_id'];
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
