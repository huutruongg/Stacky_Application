import { Document } from 'mongoose';
import { IUser } from './IUser';

export interface IAdmin extends Document {
  userId: IUser['_id'];
}
