import { Router, Request, Response } from "express";
import multer from 'multer'
import authenticateJWT from "../middlewares/authenticate.m";
import UploadFileController from "../modules/Upload/upload.controller";
// Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.post('/recruiter-image', authenticateJWT, upload.single('file'), UploadFileController.uploadRecruiterImage);
router.post('/candidate-image', authenticateJWT, upload.single('file'), UploadFileController.uploadCandidateImage);

export default router;