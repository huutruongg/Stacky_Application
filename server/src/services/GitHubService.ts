import axios from "axios";
import { log } from "console";
import JobPostRepository from "../repositories/JobPostRepository";
import { IContributor, IRepo } from "../interfaces/IGithub";

export default class GithubService {
    private jobPostRepository: JobPostRepository;

    constructor() {
        this.jobPostRepository = new JobPostRepository();
    }

    private getAllRepos = async (token: string): Promise<IRepo[]> => {
        const headers = { Authorization: `token ${token}` };
        const repos: IRepo[] = [];
        let page = 1;
        const perPage = 100;

        try {
            while (true) {
                const response = await axios.get(
                    `https://api.github.com/user/repos?per_page=${perPage}&page=${page}`,
                    { headers }
                );
                const repoData = response.data;
                if (repoData.length === 0) break;

                repoData.forEach((repo: any) => {
                    repos.push({
                        url: repo.url,
                        language: repo.language || "Unknown",
                        isPersonal: repo.owner.login === response.data[0]?.owner.login,
                        stars: repo.stargazers_count || 0,
                        forks: repo.forks_count || 0,
                        watchers: repo.watchers_count || 0,
                    });
                });
                page++;
            }
        } catch (error: any) {
            console.error("Failed to fetch repositories:", error.message);
        }
        return repos;
    };

    public calculateGitHubScore = async (
        repos: IRepo[],
        JD_languages: string,
        token: string
    ): Promise<number> => {
        const headers = { Authorization: `token ${token}` };
        const userResponse = await axios.get("https://api.github.com/user", { headers });
        const username = userResponse.data.login;

        let totalWeightedScore = 0;
        let validRepoCount = 0;
        let maxRepoScore = 0;
        const personalRepoPenalty = repos.every(repo => repo.isPersonal) ? 0.8 : 1.0;

        const filteredRepos = repos.filter(repo => JD_languages.includes(repo.language));
        for (const repo of filteredRepos) {
            try {
                const response = await axios.get<IContributor[]>(`${repo.url}/contributors`, { headers });
                const contributors = response.data;

                const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
                const userContributions = contributors.find(contributor => contributor.login === username)?.contributions || 0;

                if (totalContributions > 0) {
                    const contributionPercentage = (userContributions / totalContributions) * 100;
                    const complexityWeight = 1 + (repo.stars > 100 ? 0.2 : 0) + (repo.forks > 50 ? 0.2 : 0) + (repo.watchers > 20 ? 0.1 : 0);
                    const typeWeight = repo.isPersonal ? 0.5 : 1.0;

                    const repoScore = contributionPercentage * complexityWeight * typeWeight;
                    totalWeightedScore += repoScore;
                    maxRepoScore = Math.max(maxRepoScore, repoScore);
                    validRepoCount++;
                }
            } catch (error: any) {
                console.error(`Failed to fetch contributors for repo: ${repo.url}`, error.message);
            }
        }

        const averageScore = validRepoCount > 0 ? totalWeightedScore / validRepoCount : 0;
        const normalizedScore = maxRepoScore > 0 ? (averageScore / maxRepoScore) * 100 : 0;

        return normalizedScore * personalRepoPenalty;
    };

    public getGitHubScore = async (jobPostId: string, githubToken: string): Promise<number> => {
        const repos = await this.getAllRepos(githubToken);
        log("repos", repos);
        const jobPost = await this.jobPostRepository.findById(jobPostId);
        const jDLanguages = jobPost?.professionalSkills;
        log("jDLanguages", jDLanguages);
        if (!jDLanguages) {
            log("No job description languages found for job post: " + jobPostId);
            return 0;
        }
        const score = await this.calculateGitHubScore(repos, jDLanguages, githubToken);
        return score;
    };
}
