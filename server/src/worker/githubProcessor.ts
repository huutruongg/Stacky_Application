import GithubController from '../modules/Github/github.controller';
import { Request, Response } from 'express';

export const githubProcessor = async (req: Request, res: Response) => {
  switch (true) {
    case req.url.includes('/calculate-score') && req.method === 'POST':
      await GithubController.getGithubScore(req, res);
      break;

    default:
      throw new Error('No matching GitHub route found!');
  }
};
