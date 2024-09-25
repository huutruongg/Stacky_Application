import { Router } from "express";
import RecruiterController from "../modules/Recruiter/recruiter.controller";


const router = Router();

router.post('/forgot-password', RecruiterController.forgotPassword)
router.post('/reset-password/:id', RecruiterController.resetPassword)


export default router;