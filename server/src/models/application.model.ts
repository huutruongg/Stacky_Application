import { Schema, model } from 'mongoose';
import { IApplication } from '../types/IApplication';

const ApplicationSchema = new Schema({
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
    appliedAt: { type: Date, required: true },
    status: { type: String, required: true },
    githubScore: { type: Number, required: true }
  });
  
  export const Application = model<IApplication>('Application', ApplicationSchema);
  