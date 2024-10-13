import { IJobSaved } from './../src/types/ICandidate.d';
import { Schema, model } from 'mongoose';
const JobSavedSchema = new Schema({
  candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobPostId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: true },
  savedAt: { type: Date, default: Date.now() }
});

export const JobSaved = model<IJobSaved>('JobSaved', JobSavedSchema);
