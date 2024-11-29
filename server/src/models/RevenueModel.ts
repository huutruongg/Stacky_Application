import { Schema, model } from 'mongoose';
import { IRevenue } from '../interfaces/IRevenue';
const RevenueSchema = new Schema({
  year: { type: String, required: true },
  month: { type: String, required: true },
  depositRevenue: { type: Number, default: 0 }, 
  paymentRevenue: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export const RevenueReport = model<IRevenue>('RevenueReport', RevenueSchema);

