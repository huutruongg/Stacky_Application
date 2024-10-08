"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_controller_1 = __importDefault(require("../modules/Upload/upload.controller"));
// Configure Multer to store file in memory
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.post('/recruiter-images', upload.array('files'), upload_controller_1.default.uploadRecruiterImages);
router.post('/candidate-image', upload.array('files'), upload_controller_1.default.uploadCandidateImages);
router.delete('/recruiter-images/delete', upload_controller_1.default.deleteRecruiterImages);
router.delete('/candidate-images/delete', upload_controller_1.default.deleteCandidateImages);
exports.default = router;
