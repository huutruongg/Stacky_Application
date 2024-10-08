"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = require("mongoose");
const EnumApplicationStatus_1 = __importDefault(require("../types/EnumApplicationStatus"));
const ApplicationSchema = new mongoose_1.Schema({
    candidateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    jobPostId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    appliedAt: { type: Date, default: Date.now() },
    status: { type: String, default: EnumApplicationStatus_1.default.PENDING },
    githubScore: { type: Number, default: 0 }
});
// Make unique for the collections
ApplicationSchema.index({ candidateId: 1, jobPostId: 1 }, { unique: true });
exports.Application = (0, mongoose_1.model)('Application', ApplicationSchema);
