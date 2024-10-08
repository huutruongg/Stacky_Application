"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zaloPay_controller_1 = require("../modules/ZaloPay/zaloPay.controller");
const router = (0, express_1.Router)();
router.post('/payment', zaloPay_controller_1.ZaloPayController.createOrder);
router.post('/callback', zaloPay_controller_1.ZaloPayController.handleCallback);
router.post('/check-status-order', zaloPay_controller_1.ZaloPayController.checkOrderStatus);
exports.default = router;
