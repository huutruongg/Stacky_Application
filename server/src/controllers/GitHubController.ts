import { log } from "console";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
import CandidateRepository from "../repositories/CandidateRepository";
import GithubService from "../services/GitHubService";
import ApplicantRepository from "../repositories/ApplicantRepository";
import dotenv from "dotenv";
import { Provider } from "../enums/EProvider";
dotenv.config();

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
            const { jobPostId, token } = req.query;
            const score = await this.githubService.getGitHubScore(String(jobPostId), String(token));
            if (!score) {
                return this.sendError(res, 404, 'No data found');
            }
            const roundedScore = Math.round(score);
            log("roundedScore", roundedScore);
            await this.applicantRepository.updateGithubScore(String(userInfo.userId), String(jobPostId), roundedScore);
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
            const isLoggedInGithub = candidate.oauthToken?.provider === Provider.GITHUB;
            this.sendResponse(res, 200, { success: true, result: { isLoggedInGithub } });

        } catch (error) {
            log(error);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
}
