import { Schema, model } from 'mongoose';
import { IUser } from '../types/IUser';
import UserRole from '../types/EnumUserRole';

const UserSchema = new Schema({
    privateEmail: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        required: true,
        enum: Object.values(UserRole)
    },
    phoneNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
    refreshToken: { type: String, unique: true }
});


export const User = model<IUser>('User', UserSchema);
