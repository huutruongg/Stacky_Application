import { Document } from "mongoose";

export interface ILanguage extends Document {
    language: string;
    level: string;
}