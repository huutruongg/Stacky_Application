import { Document } from "mongoose";

export interface IRevenue extends Document {
    year: number;
    month: number;
    totalRevenue: number;
    createdAt: Date;
    updatedAt: Date;
  }
  