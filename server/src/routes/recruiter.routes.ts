import { Router } from "express";
import RecruiterController from "../modules/Recruiter/recruiter.controller";
import authenticateJWT from "../middlewares/authenticate.m";
import authorize from "../middlewares/authorize.m";
import UserRole from "../types/EnumUserRole";


const router = Router();

router.post('/forgot-password',RecruiterController.forgotPassword);
router.post('/reset-password/:id', RecruiterController.resetPassword);
router.post('/change-password/:id', RecruiterController.resetPassword);

router.post('/update-company-profile', RecruiterController.updateComapanyProfile);
router.post('/update-company-contact', RecruiterController.updateComapanyContact);

export default router;