import { Schema, model } from 'mongoose';
import { IRecruiter } from '../types/IRecruiter';

const ImageSchema = new Schema({
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, required: true }
});

const RecruiterSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, required: true },
  orgName: { type: String },
  orgField: { type: String },
  images: [ImageSchema]
});

export const Recruiter = model<IRecruiter>('Recruiter', RecruiterSchema);

