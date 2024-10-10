import CandidateController from '../modules/Candidate/candidate.controller';
import { Request, Response } from 'express';

export const candidateProcessor = async (req: Request, res: Response) => {
  switch (true) {
    case req.url.includes('/get-candidate-details') && req.method === 'GET':
      await CandidateController.getCandidateById(req, res);
      break;

    case req.url.includes('/submit-profile') && req.method === 'PUT':
      await CandidateController.submitProfessionalDetails(req, res);
      break;

    case req.url.includes('/remove-object') && req.method === 'DELETE':
      await CandidateController.removeObjectFromArray(req, res);
      break;

    default:
      throw new Error('No matching candidate route found!');
  }
};