"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = __importDefault(require("../modules/Email/email.controller"));
const router = (0, express_1.Router)();
// Route to send an email with authentication and authorization
router.post('/send-email', email_controller_1.default.sendEmail);
exports.default = router;
