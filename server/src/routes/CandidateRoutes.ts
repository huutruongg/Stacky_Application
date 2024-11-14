import { Router, Request, Response } from "express";
import CandidateController from "../../src/controllers/CandidateController";
import CandidateService from "../../src/services/CandidateService";
import CandidateRepository from "../../src/repositories/CandidateRepository";
import UserService from "../../src/services/UserService";
import GithubController from "../../src/controllers/GitHubController";
import { BaseRoutes } from "./BaseRoutes";
import { authenticateJWT } from "../middlewares/Authenticate";
import { authorizeJWT } from "../middlewares/Authorize";
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
        this.router.get('/get-candidate', authenticateJWT, this.candidateController.getCandidate); // Done
        this.router.get('/get-profile', authenticateJWT, authorizeJWT(UserRole.CANDIDATE), this.candidateController.getCandidateProfile); // Done
        this.router.put('/update-profile', authenticateJWT, this.candidateController.updateCandidateProfile); // Done
        this.router.put('/update-info', authenticateJWT, this.candidateController.updateCandidate); // Done
        this.router.delete('/delete-candidate/:userId', authenticateJWT, this.candidateController.deleteCandidate); // Done
        this.router.post('/get-github-score', authenticateJWT, this.githubController.getGithubScore);
    }
}
