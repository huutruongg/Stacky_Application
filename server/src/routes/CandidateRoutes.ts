import { Router } from "express";
import { authenticateJWT } from "../middlewares/Authenticate";
import { authorize } from "../middlewares/Authorize";
import CandidateController from "../../src/controllers/CandidateController";
import GithubController from "../../src/controllers/GitHubController";
import { BaseRoutes } from "./BaseRoutes";

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
        // Candidate-specific routes
        this.router.get(
            '/get-candidate',
            authenticateJWT,
            authorize(['getCandidate']),
            this.candidateController.getCandidate
        );

        this.router.get("/get-applied-jobs", authenticateJWT, authorize(['getAppliedJobs']), this.candidateController.getAppliedJobs);

        this.router.get(
            '/get-profile',
            authenticateJWT,
            authorize(['getCandidateProfile']),
            this.candidateController.getCandidateProfile
        );

        this.router.put(
            '/update-profile',
            authenticateJWT,
            authorize(['updateCandidateProfile']),
            this.candidateController.updateCandidateProfile
        );

        this.router.put(
            '/update-info',
            authenticateJWT,
            authorize(['updateCandidate']),
            this.candidateController.updateCandidate
        );

        this.router.delete(
            '/delete-candidate/:userId',
            authenticateJWT,
            authorize(['deleteCandidate']),
            this.candidateController.deleteCandidate
        );

        this.router.post(
            '/get-github-score',
            authenticateJWT,
            authorize(['getGithubScore']),
            this.githubController.getGithubScore
        );
    }
}