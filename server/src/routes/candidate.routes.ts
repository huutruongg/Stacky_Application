import { Router } from 'express';
import CandidateController from '../modules/Candidate/candidate.controller';

const router = Router();

router.put('/submit-profile', CandidateController.submitProfessionalDetails);
router.get('/get-candidate-details/:candidateId', CandidateController.getCandidateById);
router.delete('/remove-object', CandidateController.removeObjectFromArray);

export default router;
