import { Schema, model } from 'mongoose';
import { IRevenue } from '../types/IRevenue';
const RevenueSchema = new Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  totalRevenue: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

export const MonthlyPayment = model<IRevenue>('MonthlyPayment', RevenueSchema);
