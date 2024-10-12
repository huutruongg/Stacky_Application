import { Document } from 'mongoose';
import { IUser } from './IUser';

export interface IImage {
  imageUrl: string;
  uploadedAt: Date;
}

export interface IPayment {
  payAmount: number;
  transactionDate: Date;
}

export interface IRecruiter extends Document {
  userId: IUser['_id'];
  orgEmail: string,
  orgName: string;
  orgField: string;
  orgScale: string;
  orgTaxNumber: string;
  orgAddress: string;
  images?: IImage[];
  payments?: IPayment[];
  balance: number;
}
