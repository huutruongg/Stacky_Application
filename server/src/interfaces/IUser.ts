import { Document } from "mongoose";

export interface IUser extends Document {
    privateEmail: string;
    password: string;
    role: string;
    phoneNumber?: string;
    createdAt?: Date;
}
