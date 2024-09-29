import { Router, Request, Response } from "express";
import authenticateJWT from "../middlewares/authenticate.m";
import GithubController from "../modules/Github/github.controller";

const router = Router();

router.post('/calculate-score', (req: Request, res: Response) => { GithubController.getGithubScore(req, res)})

export default router;

