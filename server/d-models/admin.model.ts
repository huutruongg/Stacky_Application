import { Schema, model } from 'mongoose';
import { IAdmin } from '../types/IAdmin';

const AdminSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Admin = model<IAdmin>('Admin', AdminSchema);
