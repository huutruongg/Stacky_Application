import { Document } from "mongoose";
import { ILanguage } from "./ILanguage";
import { IUser } from "./IUser";
import { PostStatus } from "../enums/EPostStatus";
import { ApplyStatus } from "../enums/EApplySatus";

export interface IJobPost extends Document {
    userId: IUser['_id'];
    jobTitle: string;
    jobImage: string;
    orgName: string;
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
    applicationDeadline: Date;
    jobSchedule: Date;
    staffLevel: string;
    genderRequired: string;
    postedAt: Date;
    invisible: boolean;
}

export interface IJobPostMin {
    _id: IJobPost['_id'];
    jobTitle: string;
    jobImage: string;
    orgName: string;
    jobSalary: string;
    location: string;
    applicationDeadline: Date;
    userId?: IUser['_id'];
}

export interface IJobSaved extends Document {
    jobPostId: IJobPost['_id'];
    savedAt?: Date;
}

export interface IJobApplied extends Document {
    jobPostId: IJobPost['_id'];
    status?: ApplyStatus;
    githubScore?: number;
    appliedAt?: Date;
}

