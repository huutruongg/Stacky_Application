import { Router } from "express";
import CandidateController from "../../src/controllers/CandidateController";
import GithubController from "../../src/controllers/GitHubController";
import { BaseRoutes } from "./BaseRoutes";
import refreshToken from "../middlewares/refreshToken";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";
export default class CandidateRoutes extends BaseRoutes {
    private candidateController: CandidateController;
    private githubController: GithubController;

    constructor(candidateController: CandidateController, githubController: GithubController) {
        super();
        this.candidateController = candidateController;
        this.githubController = githubController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Candidate-specific routes
        this.router.get(
            '/get-candidate',
            refreshToken, authenticate, authorize(['getCandidate']),
            this.candidateController.getCandidate
        );

        this.router.get("/get-applied-jobs", refreshToken, authenticate, authorize(['getAppliedJobs']),
            this.candidateController.getAppliedJobs);

        this.router.get(
            '/get-profile',
            refreshToken, authenticate, authorize(['getCandidateProfile']),
            this.candidateController.getCandidateProfile
        );

        this.router.put(
            '/update-profile',
            refreshToken, authenticate, authorize(['updateCandidateProfile']),
            this.candidateController.updateCandidateProfile
        );

        this.router.put(
            '/update-info',
            refreshToken, authenticate, authorize(['updateCandidate']),
            this.candidateController.updateCandidate
        );

        this.router.delete(
            '/delete-candidate/:userId',
            refreshToken, authenticate, authorize(['deleteCandidate']),
            this.candidateController.deleteCandidate
        );

        this.router.post(
            '/get-github-score',
            refreshToken, authenticate, authorize(['getGithubScore']),
            this.githubController.getGithubScore
        );
    }
}