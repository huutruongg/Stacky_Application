import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import qs from 'qs';
import { Config, Item, PostData, Transaction } from '../interfaces/IPayment';
import dotenv from 'dotenv';
dotenv.config();

export default class PaymentService {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async createTransaction() {
    const embedData = {
      redirectUrl: process.env.URL_SERVER,
    };

    const items: Item[] = [
      { name: 'Product 1', price: 100000, quantity: 1 },
    ];

    const transactionId = Math.floor(Math.random() * 1000000);

    const transaction: Transaction = {
      app_id: this.config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transactionId}`,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      amount: items.reduce((total, item) => total + item.price * item.quantity, 0),
      callback_url: 'http://4080/home/callback',
      description: `Payment for order #${transactionId}`,
      bank_code: '',
    };

    const data = `${this.config.app_id}|${transaction.app_trans_id}|${transaction.app_user}|${transaction.amount}|${transaction.app_time}|${transaction.embed_data}|${transaction.item}`;
    transaction.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

    try {
      const result = await axios.post(this.config.endpoint, null, { params: transaction });
      return result.data;
    } catch (error) {
      throw new Error('Error creating order');
    }
  }

  async checkTransactionStatus(appTransId: string) {
    const postData: PostData = {
      app_id: this.config.app_id,
      app_trans_id: appTransId,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${this.config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

    try {
      const result = await axios.post('https://sb-openapi.zalopay.vn/v2/query', qs.stringify(postData), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return result.data;
    } catch (error) {
      throw new Error('Error checking order status');
    }
  }

  verifyCallback(data: any): boolean {
    const dataStr = data.data;
    const reqMac = data.mac;
    const mac = CryptoJS.HmacSHA256(dataStr, this.config.key2).toString();

    return reqMac === mac;
  }
}
