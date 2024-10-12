import { Schema, model } from 'mongoose';
import { IRecruiter } from '../types/IRecruiter';

const ImageSchema = new Schema({
  imageUrl: { type: String },
  uploadedAt: { type: Date}
});

const RecruiterSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orgEmail: { type: String },
  orgName: { type: String },
  orgField: { type: String },
  orgScale: { type: String },
  orgTaxNumber: { type: String },
  orgAddress: { type: String },
  images: [ImageSchema],
  balance: {type: Number, default: 0}
});

export const Recruiter = model<IRecruiter>('Recruiter', RecruiterSchema);
