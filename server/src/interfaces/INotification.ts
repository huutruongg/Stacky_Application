import { Document } from "mongoose";
import { IUser } from "./IUser";

export interface INotification extends Document {
    userId: IUser['_id'];
    message: string;
    jobTitle: string;
    unread: boolean;
    createdAt: Date
}