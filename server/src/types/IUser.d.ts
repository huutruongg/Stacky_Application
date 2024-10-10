import { Document } from 'mongoose';
import UserRole from './EnumUserRole';

export interface IUser extends Document {
    privateEmail: string,
    password?: string,
    role: UserRole,
    phoneNumber?: string,
    createdAt: Date;
    refreshToken?: string
}
