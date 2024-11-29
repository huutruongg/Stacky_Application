import { Document } from "mongoose";

export interface IRevenue extends Document {
  year: string;
  month: string;
  depositRevenue: number;
  paymentRevenue: number;
  updatedAt: Date;
}
