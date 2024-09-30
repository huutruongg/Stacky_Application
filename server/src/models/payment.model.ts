import { Schema, model } from 'mongoose';
import { IPayment } from '../types/IPayment';
const PaymentSchema = new Schema({
    recruiterId: { type: Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    payAmount: { type: Number, required: true },
    transactionDate: { type: Date, required: true }
  });
  
  export const Payment = model<IPayment>('Payment', PaymentSchema);
  