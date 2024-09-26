import { Router, Request, Response } from "express";
import multer from 'multer'
import authenticateJWT from "../middlewares/authenticate.m";
import UploadFileController from "../modules/Upload/upload.controller";
// Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.post('/recruiter-image', upload.array('files'), UploadFileController.uploadRecruiterImages);
router.post('/candidate-image', upload.array('files'), UploadFileController.uploadCandidateImages);
router.delete('/recruiter-images/delete', UploadFileController.deleteRecruiterImages);
router.delete('/candidate-images/delete', UploadFileController.deleteCandidateImages);
export default router;