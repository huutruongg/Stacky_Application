import { Request } from "express";
import { UserRole } from '../enums/EUserRole';
import { Session, SessionData } from 'express-session';

// export interface CustomRequest extends Request {
//     userData: {
//         userId: string;
//         role: UserRole;
//         accessToken: string;
//     };
// }

export interface CustomSessionRequest extends Request {
    session: Session & Partial<SessionData>;
}