import { Router } from "express";
import RecruiterController from "../modules/Recruiter/recruiter.controller";


const router = Router();

router.post('/forgot-password', RecruiterController.forgotPassword)
router.post('/reset-password/:id', RecruiterController.resetPassword)
router.post('/change-password/:id', RecruiterController.resetPassword)

router.post('/update-company-profile', RecruiterController.updateComapanyProfile)
router.post('/update-company-contact', RecruiterController.updateComapanyContact)

export default router;