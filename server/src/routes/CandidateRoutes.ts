import { Router } from "express";
import CandidateController from "../../src/controllers/CandidateController";
import GithubController from "../../src/controllers/GitHubController";
import { BaseRoutes } from "./BaseRoutes";
import verifyToken from "../middlewares/verifyToken";
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
            verifyToken, refreshToken, authenticate, authorize(['getCandidate']),
            this.candidateController.getCandidate
        );

        this.router.get("/get-applied-jobs", verifyToken, refreshToken, authenticate, authorize(['getAppliedJobs']),
            this.candidateController.getAppliedJobs);

        this.router.get(
            '/get-profile',
            verifyToken, refreshToken, authenticate, authorize(['getCandidateProfile']),
            this.candidateController.getCandidateProfile
        );

        this.router.put(
            '/update-profile',
            verifyToken, refreshToken, authenticate, authorize(['updateCandidateProfile']),
            this.candidateController.updateCandidateProfile
        );

        this.router.put(
            '/update-info',
            verifyToken, refreshToken, authenticate, authorize(['updateCandidate']),
            this.candidateController.updateCandidate
        );

        this.router.delete(
            '/delete-candidate/:userId',
            verifyToken, refreshToken, authenticate, authorize(['deleteCandidate']),
            this.candidateController.deleteCandidate
        );

        this.router.post(
            '/get-github-score',
            verifyToken, refreshToken, authenticate, authorize(['getGithubScore']),
            this.githubController.getGithubScore
        );
    }
}