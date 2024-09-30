import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
  recruiterId: Types.ObjectId;
  payAmount: number;
  transactionDate: Date;
}
