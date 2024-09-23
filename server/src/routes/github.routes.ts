import { Router, Request, Response } from "express";
import GithubController from "../controllers/github.controller";
import authenticateJWT from "../middlewares/authenticate.m";

const router = Router();

router.post('/calculate-score', authenticateJWT, (req: Request, res: Response) => { GithubController.getGithubScore(req, res)})

export default router;

