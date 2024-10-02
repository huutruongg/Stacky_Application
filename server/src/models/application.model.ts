import { Schema, model } from 'mongoose';
import { IApplication } from '../types/IApplication';
import ApplyStatus from '../types/EnumApplicationStatus';

const ApplicationSchema = new Schema({
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
  appliedAt: { type: Date, default: Date.now() },
  status: { type: String, default: ApplyStatus.PENDING },
  githubScore: { type: Number, default: 0 }
});
// Make unique for the collections
ApplicationSchema.index({ candidateId: 1, jobPostId: 1 }, { unique: true });

export const Application = model<IApplication>('Application', ApplicationSchema);
