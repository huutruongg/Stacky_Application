import { Document } from "mongoose";

export interface IOAuthToken extends Document {
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string;
}