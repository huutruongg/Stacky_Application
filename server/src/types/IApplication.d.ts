import { Document, Types } from 'mongoose';

export interface IApplication extends Document {
    candidateId: Types.ObjectId;
    jobPostId: Types.ObjectId;
    appliedAt: Date;
    status: string;
    jobPost?: IJobPost;
    githubScore: number;
}
