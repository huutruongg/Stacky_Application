import { Router, Request, Response } from "express";
import EmailController from "../controllers/email.controllers";
const router = Router();

router.post('/send-email', (req: Request, res: Response) => { EmailController.sendEmail(req, res); })

export default router;