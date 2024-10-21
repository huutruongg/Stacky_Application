import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../enums/EUserRole';
import { IUser } from '../interfaces/IUser';

// Define the schema for the UserModel
const UserSchema = new Schema({
    privateEmail: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CANDIDATE },
    phoneNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
    refreshToken:{ type: String}
});

// Create and export the UserModel
const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;