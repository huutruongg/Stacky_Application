import { Document } from "mongoose";

export interface IOAuthToken extends Document {
    provider: string;
    accessToken: string;
}