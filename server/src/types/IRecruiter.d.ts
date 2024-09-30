import { Document } from 'mongoose';

export interface IImage {
  imageUrl: string;
  uploadedAt: Date;
}

export interface IRecruiter extends Document {
  email: string;
  password: string;
  phoneNumber: string;
  createdAt: Date;
  orgName?: string;
  orgField?: string;
  images?: IImage[];
}
