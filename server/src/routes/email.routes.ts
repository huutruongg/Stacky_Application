import { Router, Request, Response } from "express";
import EmailController from "../controllers/email.controller";
import authenticate from "../middlewares/authenticate.m";
import authorize from "../middlewares/authorize.m";
import UserRole from "../utils/types/IUserRole";
const router = Router();

router.post('/send-email', authenticate, authorize(UserRole.ADMIN, UserRole.RECRUITER), (req: Request, res: Response) => { EmailController.sendEmail(req, res); })

export default router;