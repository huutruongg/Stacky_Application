import { Document } from 'mongoose';

export interface IAdmin extends Document {
  userId: string;
}
