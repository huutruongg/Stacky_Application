import { Request } from "express";
import { UserRoles } from '../utils/roles';
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