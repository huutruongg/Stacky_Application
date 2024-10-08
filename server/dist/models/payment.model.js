"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    recruiterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    payAmount: { type: Number, required: true },
    transactionDate: { type: Date, required: true }
});
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
