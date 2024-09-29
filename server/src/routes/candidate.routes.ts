import { Router } from "express";
import CandidateCotroller from "../modules/Candidate/candidate.controller";


const router = Router();

router.post('/submit-profile', CandidateCotroller.submitProfessionalDetails);


export default router;