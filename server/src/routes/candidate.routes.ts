import { Router } from "express";
import CandidateCotroller from "../modules/Candidate/candidate.controller";
import authenticateJWT from "../middlewares/authenticate.m";
import UserRole from "../types/EnumUserRole";


const router = Router();

router.put('/submit-profile', CandidateCotroller.submitProfessionalDetails);
router.get('/get-candidate-details/:candidateId', CandidateCotroller.getCandidateById)

export default router;