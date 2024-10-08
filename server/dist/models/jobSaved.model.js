"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSaved = void 0;
const mongoose_1 = require("mongoose");
const JobSavedSchema = new mongoose_1.Schema({
    candidateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    jobSavedId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    savedAt: { type: Date, default: Date.now() }
});
exports.JobSaved = (0, mongoose_1.model)('JobSaved', JobSavedSchema);
