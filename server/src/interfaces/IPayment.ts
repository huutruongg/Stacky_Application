import { Document } from "mongoose";

export interface IPayment extends Document {
  payAmount: number;
  transactionDate: Date;
  isDeposit: boolean;
}

export interface PaymentInfo {
  balance: number;
  payments: IPayment[];   
}

export interface Config {
  app_id: string;
  key1: string;
  key2: string;
  endpoint: string;
}

export interface Item {
  name: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  app_id: string;
  app_trans_id: string;
  app_user: string;
  app_time: number;
  item: string;
  embed_data: string;
  amount: number;
  callback_url: string;
  description: string;
  bank_code: string;
  mac?: string;
}

export interface PostData {
  app_id: string;
  app_trans_id: string;
  mac?: string;
}