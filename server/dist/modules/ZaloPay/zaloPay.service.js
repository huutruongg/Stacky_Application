"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloPayService = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const moment_1 = __importDefault(require("moment"));
const qs_1 = __importDefault(require("qs"));
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};
exports.ZaloPayService = {
    createOrder: () => __awaiter(void 0, void 0, void 0, function* () {
        const embed_data = {
            redirecturl: 'http://localhost:4080/home',
        };
        const items = [
            { name: 'Product 1', price: 1000, quantity: 1 },
        ];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${(0, moment_1.default)().format('YYMMDD')}_${transID}`,
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
        order.mac = crypto_js_1.default.HmacSHA256(data, config.key1).toString();
        try {
            const result = yield axios_1.default.post(config.endpoint, null, { params: order });
            return result.data;
        }
        catch (error) {
            throw new Error('Error creating order');
        }
    }),
    checkOrderStatus: (app_trans_id) => __awaiter(void 0, void 0, void 0, function* () {
        const postData = {
            app_id: config.app_id,
            app_trans_id,
        };
        const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
        postData.mac = crypto_js_1.default.HmacSHA256(data, config.key1).toString();
        try {
            const result = yield axios_1.default.post('https://sb-openapi.zalopay.vn/v2/query', qs_1.default.stringify(postData), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return result.data;
        }
        catch (error) {
            throw new Error('Error checking order status');
        }
    }),
    // Định nghĩa hàm verifyCallback
    verifyCallback: (data) => {
        const dataStr = data.data;
        const reqMac = data.mac;
        const mac = crypto_js_1.default.HmacSHA256(dataStr, config.key2).toString();
        return reqMac === mac;
    }
};
