import { session } from 'express-session';
// types/Custom.ts
import { Request } from "express";
import { UserRole } from "./EnumUserRole";
import { CustomSession } from './session';

export interface CustomRequest extends Request {
    userData: {
        userId: string;
        email: string
        role: UserRole;
    };
}

export interface CustomSessionRequest extends Request {
    session?: CustomSession;
}

export type UserDataType = {
    userId: string;
    email: string;
    role: UserRole;
};

export type AuthUserType = UserType & {
    token?: string;
};
