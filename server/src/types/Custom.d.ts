// types/Custom.ts
import { Request } from "express";
import { UserRole } from "./EnumUserRole";

export interface CustomRequest extends Request {
    userData: {
        userId: string;
        email: string
        role: UserRole;
    };
}

export type UserDataType = {
    userId: string;
    email: string;
    role: UserRole;
};

export type AuthUserType = UserType & {
    token?: string;
};
