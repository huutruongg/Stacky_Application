import { Repo } from "../interfaces/IGithub";
import GithubService from "../services/GitHubService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";


export default class GithubController extends BaseController {
    private githubService: GithubService;

    constructor(githubService: GithubService) {
        super();
        this.githubService = githubService;
    }

    public async getGithubScore(req: Request, res: Response): Promise<void> {
        const username = req.params.username;
        const JD_languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin'];
        const result = await this.githubService.calculateTotalScore(
            await this.githubService.fetchUserRepositories(username),
            JD_languages,
            username
        )
        if (!result) {
            return this.sendError(res, 404, 'User not found!');
        }

    }
}
