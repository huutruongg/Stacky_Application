import { Router, Request, Response } from "express";
import authenticateJWT from "../middlewares/authenticate.m";
import GithubController from "../modules/Github/github.controller";
import UserRole from "../types/EnumUserRole";

const router = Router();

router.post('/calculate-score', GithubController.getGithubScore);

export default router;

