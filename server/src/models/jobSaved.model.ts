import { Schema, model } from 'mongoose';
import { IJobSaved } from '../types/IJobSaved';
const JobSavedSchema = new Schema({
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobSavedId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
  savedAt: { type: Date, default: Date.now() }
});

export const JobSaved = model<IJobSaved>('JobSaved', JobSavedSchema);
