import { Schema, model } from 'mongoose';
import { IAdmin } from '../types/IAdmin';

const AdminSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export const Admin = model<IAdmin>('Admin', AdminSchema);
