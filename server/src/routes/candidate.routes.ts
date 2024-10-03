import { Router } from "express";
import CandidateCotroller from "../modules/Candidate/candidate.controller";
import authenticateJWT from "../middlewares/authenticate.m";
import UserRole from "../types/EnumUserRole";
import authorize from "../middlewares/authorize.m";


const router = Router();

router.post('/submit-profile', CandidateCotroller.submitProfessionalDetails);
router.get('/get-candidate-details/:candidateId', CandidateCotroller.getCandidateById)

export default router;