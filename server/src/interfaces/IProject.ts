import { Document } from "mongoose";

export interface IProject extends Document {
    projectName: string;
    projectTime: string;
    urlRepo?: string;
    projectDescription?: string;
}