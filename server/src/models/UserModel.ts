import mongoose, { Schema } from 'mongoose';
import { UserRoles } from '../utils/roles';
import { IUser } from '../interfaces/IUser';

// Define the schema for the UserModel
const UserSchema = new Schema({
    privateEmail: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: Object.values(UserRoles), default: UserRoles.CANDIDATE },
    phoneNumber: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Create and export the UserModel
const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;