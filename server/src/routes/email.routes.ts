import { Router, Request, Response } from "express";
import EmailController from "../controllers/email.controller";
import authenticateJWT from "../middlewares/authenticate.m";
import authorize from "../middlewares/authorize.m";
import UserRole from "../utils/types/IUserRole";

const router = Router();

// Route to send an email with authentication and authorization
router.post('/send-email', authenticateJWT,  authorize(UserRole.ADMIN, UserRole.RECRUITER),  EmailController.sendEmail);

export default router;
