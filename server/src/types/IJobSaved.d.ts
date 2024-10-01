import { Document, Types } from 'mongoose';

export interface IJobSaved extends Document {
  candidateId: Types.ObjectId;
  jobSavedId: Types.ObjectId;
  jobPost?: IJobPost;
  savedAt: Date;
}
