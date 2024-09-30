import { Router, Request, Response } from "express";
import authenticateJWT from "../middlewares/authenticate.m";
import authorize from "../middlewares/authorize.m";
import UserRole from "../types/EnumUserRole";
import EmailController from "../modules/Email/email.controller";


const router = Router();

// Route to send an email with authentication and authorization
router.post('/send-email', authenticateJWT, authorize(UserRole.ADMIN, UserRole.RECRUITER), EmailController.sendEmail);

export default router;
