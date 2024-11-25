import { log } from "console";
import { Repo } from "../interfaces/IGithub";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
import CandidateRepository from "../repositories/CandidateRepository";
import GithubService from "../services/GitHubService";
import { App } from "firebase-admin/app";
import ApplicantRepository from "../repositories/ApplicantRepository";


export default class GithubController extends BaseController {
    private githubService: GithubService;
    private applicantRepository: ApplicantRepository;
    constructor(githubService: GithubService, applicantRepository: ApplicantRepository) {
        super();
        this.githubService = githubService;
        this.applicantRepository = applicantRepository;
    }

    public async getGithubScore(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = (req as any).userData;
            const jobPostId = req.params.jobPostId;
            const score = await this.githubService.getGitHubScore(String(userInfo.userId), jobPostId);
            if (!score) {
                return this.sendError(res, 404, 'No data found');
            }
            const roundedScore = Math.round(score);
            log("roundedScore", roundedScore);
            const isUpdated = await this.applicantRepository.updateGithubScore(String(userInfo.userId), jobPostId, roundedScore);
            // if (!isUpdated) {
            //     return this.sendError(res, 500, 'Failed to update score');
            // }
            return this.sendResponse(res, 200, { success: true, score: roundedScore });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async isLoggedInGithub(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = (req as any).userData;
            log("userInfo", userInfo);
            const candidateRepo = new CandidateRepository();
            const candidate = await candidateRepo.findByUserId(userInfo.userId);
            if (!candidate) {
                return this.sendError(res, 404, 'No candidate found');
            }
            if (!Array.isArray(candidate.oauthTokens)) {
                return this.sendError(res, 404, 'No oauth tokens found');
            }
            const isLoggedInGithub = Array.isArray(candidate?.oauthTokens) && candidate.oauthTokens.some(token => token.provider === "GITHUB");
            this.sendResponse(res, 200, { success: true, result: { isLoggedInGithub } });

        } catch (error) {
            log(error);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
}
