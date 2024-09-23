import { Router, Request, Response } from "express";
import multer from 'multer'
import UploadFileController from "../controllers/uploadFile.controller";
import authenticateJWT from "../middlewares/authenticate.m";
// Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.post('/upload-recruiter-image', authenticateJWT, upload.single('file'), UploadFileController.uploadRecruiterImage);
router.post('/upload-candidate-image', authenticateJWT, upload.single('file'), UploadFileController.uploadCandidateImage);

export default router;