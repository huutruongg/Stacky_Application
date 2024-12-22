import path from "path";
import GithubController from "../controllers/GitHubController";
import CandidateModel from "../models/CandidateModel";
import JobPostModel from "../models/JobPostModel";
import { BaseRoutes } from "./BaseRoutes";
import { Request, Response } from "express";
import { authenticateJWT } from "../middlewares/Authenticate";
import { authorize } from "../middlewares/Authorize";
export default class GithubRoutes extends BaseRoutes {
    private githubController: GithubController;
    constructor(githubController: GithubController) {
        super();
        this.githubController = githubController;
        this.autoBindControllerMethods(this.githubController);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/github-score', this.serveGithubPage);
        this.router.get('/is-github-logged-in', authenticateJWT, authorize(['isLoggedInGithub']), this.githubController.isLoggedInGithub);
        this.router.get('/get-github-score', authenticateJWT, authorize(['getGithubScore']), this.githubController.getGithubScore);
    }
    
    private serveGithubPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/github.html'));
    }
}