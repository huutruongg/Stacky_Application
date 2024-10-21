import { Document } from "mongoose";

export interface IEducation extends Document {
    schoolName: string;
    startDate: Date;
    finishDate: Date;
    fieldName: string;
}