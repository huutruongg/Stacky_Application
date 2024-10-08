"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recruiter = void 0;
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    imageUrl: { type: String },
    uploadedAt: { type: Date }
});
const RecruiterSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    orgEmail: { type: String },
    orgName: { type: String },
    orgField: { type: String },
    orgScale: { type: String },
    orgTaxNumber: { type: String },
    orgAddress: { type: String },
    images: [ImageSchema],
    balance: { type: Number, default: 0 }
});
exports.Recruiter = (0, mongoose_1.model)('Recruiter', RecruiterSchema);
