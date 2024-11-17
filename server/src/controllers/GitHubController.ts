import { log } from "console";
import { Repo } from "../interfaces/IGithub";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
import CandidateRepository from "../repositories/CandidateRepository";
import GithubService from "../services/GitHubService";


export default class GithubController extends BaseController {
    private githubService: GithubService;
    // private candidateRepo: CandidateRepository;
    constructor() {
        super();
        this.githubService = new GithubService();
    }

    public async getGithubScore(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = (req as any).userData;
            const jobPostId = req.params.jobPostId;
            const result = await this.githubService.getGitHubScore(String(userInfo.userId), jobPostId);
            if (!result) {
                return this.sendError(res, 404, 'No data found');
            }
            return this.sendResponse(res, 200, {success: true, result});
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
