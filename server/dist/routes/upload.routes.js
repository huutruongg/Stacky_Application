"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authenticate_m_1 = __importDefault(require("../middlewares/authenticate.m"));
const upload_controller_1 = __importDefault(require("../modules/Upload/upload.controller"));
// Configure Multer to store file in memory
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.post('/recruiter-image', authenticate_m_1.default, upload.single('file'), upload_controller_1.default.uploadRecruiterImage);
router.post('/candidate-image', authenticate_m_1.default, upload.single('file'), upload_controller_1.default.uploadCandidateImage);
exports.default = router;
