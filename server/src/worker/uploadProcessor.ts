import UploadFileController from '../modules/Upload/upload.controller';
import { Request, Response } from 'express';

export const uploadProcessor = async (req: Request, res: Response) => {
  switch (true) {
    case req.url.includes('/recruiter-images') && req.method === 'POST':
      await UploadFileController.uploadRecruiterImages(req, res);
      break;

    case req.url.includes('/candidate-image') && req.method === 'POST':
      await UploadFileController.uploadCandidateImages(req, res);
      break;

    case req.url.includes('/recruiter-images/delete') && req.method === 'DELETE':
      await UploadFileController.deleteRecruiterImages(req, res);
      break;

    case req.url.includes('/candidate-images/delete') && req.method === 'DELETE':
      await UploadFileController.deleteCandidateImages(req, res);
      break;

    default:
      throw new Error('No matching upload route found!');
  }
};
