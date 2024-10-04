import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import qs from 'qs';

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
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

interface PostData {
  app_id: string;
  app_trans_id: string;
  mac?: string;
}

export const ZaloPayService = {
  createOrder: async () => {
    const embed_data = {
      redirecturl: 'http://localhost:4080/home',
    };

    const items: Item[] = [
      { name: 'Product 1', price: 1000, quantity: 1 },
    ];

    const transID = Math.floor(Math.random() * 1000000);

    const order: Order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: items.reduce((total, item) => total + item.price * item.quantity, 0),
      callback_url: 'http://4080/home/callback',
      description: `Payment for order #${transID}`,
      bank_code: '',
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      return result.data;
    } catch (error) {
      throw new Error('Error creating order');
    }
  },

  checkOrderStatus: async (app_trans_id: string) => {
    const postData: PostData = {
      app_id: config.app_id,
      app_trans_id,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post('https://sb-openapi.zalopay.vn/v2/query', qs.stringify(postData), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return result.data;
    } catch (error) {
      throw new Error('Error checking order status');
    }
  },

  // Định nghĩa hàm verifyCallback
  verifyCallback: (data: any): boolean => {
    const dataStr = data.data;
    const reqMac = data.mac;
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    return reqMac === mac;
  }
};
