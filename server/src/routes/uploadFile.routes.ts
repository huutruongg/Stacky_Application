import { Router, Request, Response } from "express";
import multer from 'multer'
import UploadFileController from "../controllers/uploadFile.controller";
// Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.post('/upload-recruiter-image', upload.single('file'), async (req: Request, res: Response) => { UploadFileController.uploadRecuiterImage(req, res) });
router.post('/upload-candidate-image', upload.single('file'), async (req: Request, res: Response) => { UploadFileController.uploadCandidateImage(req, res) });

export default router;