import { Router, Request, Response } from "express";
import CandidateController from "../../src/controllers/CandidateController";
import CandidateService from "../../src/services/CandidateService";
import CandidateRepository from "../../src/repositories/CandidateRepository";
import UserService from "../../src/services/UserService";
import GithubController from "../../src/controllers/GitHubController";
import { BaseRoutes } from "./BaseRoutes";
import { authenticateJWT } from "../../src/middlewares/AuthenticateMiddleware";
import { authorizeJWT } from "../../src/middlewares/AuthorizeMiddleware";
import { UserRole } from "../../src/enums/EUserRole";

export default class CandidateRoutes extends BaseRoutes {
    private candidateController: CandidateController;
    private githubController: GithubController;

    constructor(candidateController: CandidateController, githubController: GithubController) {
        super();
        this.candidateController = candidateController;
        this.githubController = githubController;
        this.autoBindControllerMethods(this.candidateController);
        this.autoBindControllerMethods(this.githubController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/get-candidate', authenticateJWT, this.candidateController.getCandidate);
        this.router.put('/update-info', authenticateJWT, this.candidateController.updateCandidate);
        this.router.delete('/delete-candidate/:userId', authenticateJWT, this.candidateController.deleteCandidate);
        this.router.post('/get-github-score', authenticateJWT, this.githubController.getGithubScore)
    }
}
