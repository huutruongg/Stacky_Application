import { Router, Request, Response } from "express";
import authenticateJWT from "../middlewares/authenticate.m";
import GithubController from "../modules/Github/github.controller";
import UserRole from "../types/EnumUserRole";
import authorizeJWT from "../middlewares/authorize.m";

const router = Router();

router.post('/calculate-score', authenticateJWT,  GithubController.getGithubScore);

export default router;

