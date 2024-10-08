"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyPayment = void 0;
const mongoose_1 = require("mongoose");
const RevenueSchema = new mongoose_1.Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    totalRevenue: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
});
exports.MonthlyPayment = (0, mongoose_1.model)('MonthlyPayment', RevenueSchema);
