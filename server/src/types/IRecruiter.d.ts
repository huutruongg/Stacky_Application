import { Document } from 'mongoose';

export interface IImage {
  imageUrl: string;
  uploadedAt: Date;
}

export interface IRecruiter extends Document {
  userId: string;
  orgEmail: string,
  orgName: string;
  orgField: string;
  orgScale: string;
  orgTaxNumber: string;
  orgAddress: string;
  images?: IImage[];
  balance?: number
}
