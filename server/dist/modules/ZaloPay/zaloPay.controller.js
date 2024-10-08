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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloPayController = void 0;
const zaloPay_service_1 = require("./zaloPay.service");
exports.ZaloPayController = {
    createOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield zaloPay_service_1.ZaloPayService.createOrder();
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
    handleCallback: (req, res) => {
        try {
            const isValid = zaloPay_service_1.ZaloPayService.verifyCallback(req.body);
            if (!isValid) {
                return res.status(400).json({ message: 'Invalid callback data' });
            }
            console.log("Update order status as success based on app_trans_id");
            return res.status(200).json({ return_code: 1, return_message: 'success' });
        }
        catch (error) {
            return res.status(500).json({ return_code: 0, return_message: error.message });
        }
    },
    checkOrderStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { app_trans_id } = req.body;
        try {
            const data = yield zaloPay_service_1.ZaloPayService.checkOrderStatus(app_trans_id);
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    })
};
