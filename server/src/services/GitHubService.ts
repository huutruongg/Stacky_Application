import axios from "axios";
import { log } from "console";
import CandidateRepository from "../repositories/CandidateRepository";
import JobPostRepository from "../repositories/JobPostRepository";

// Define types for the response data
interface Contributor {
    login: string;
    contributions: number;
}

interface Repo {
    url: string;
    language: string;
    isPersonal: boolean;
    stars: number;
    forks: number;
    watchers: number;
}

export default class GithubService {
    private candidateRepo: CandidateRepository;
    private jobPostRepository: JobPostRepository;
    constructor() {
        this.candidateRepo = new CandidateRepository();
        this.jobPostRepository = new JobPostRepository();
    }

    private getAllRepos = async (token: string): Promise<Repo[]> => {
        const headers = {
            Authorization: `token ${token}`,
        };
        const repos: Repo[] = [];
        let page = 1;
        const perPage = 100; // GitHub API supports pagination with a max of 100 items per page
        try {
            while (true) {
                // Fetch repositories (including private and collaboration repos)
                const response = await axios.get(
                    `https://api.github.com/user/repos?per_page=${perPage}&page=${page}`,
                    { headers }
                );
                const repoData = response.data;
                // If no more repos, exit the loop
                if (repoData.length === 0) break;
                // Add repo URL, language, and additional metadata to the array
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
        repos: Repo[],
        JD_languages: string,
        token: string
    ): Promise<number> => {
        const headers = {
            Authorization: `token ${token}`,
        };
        const userResponse = await axios.get("https://api.github.com/user", { headers });
        const username = userResponse.data.login;
    
        let totalWeightedScore = 0; // Tổng điểm có trọng số
        let validRepoCount = 0; // Số repo hợp lệ
        let maxRepoScore = 0; // Điểm cao nhất trong các repo
        const personalRepoPenalty = repos.every(repo => repo.isPersonal) ? 0.8 : 1.0; // Phạt nếu chỉ có repo cá nhân
    
        // Lọc các repo theo JD_languages
        const filteredRepos = repos.filter(repo => JD_languages.includes(repo.language));
        for (const repo of filteredRepos) {
            try {
                // Lấy danh sách contributors
                const response = await axios.get<Contributor[]>(`${repo.url}/contributors`, { headers });
                const contributors = response.data;
    
                const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
                const userContributions = contributors.find(contributor => contributor.login === username)?.contributions || 0;
    
                if (totalContributions > 0) {
                    const contributionPercentage = (userContributions / totalContributions) * 100;
    
                    const complexityWeight =
                        1 + (repo.stars > 100 ? 0.2 : 0) + (repo.forks > 50 ? 0.2 : 0) + (repo.watchers > 20 ? 0.1 : 0);
    
                    const typeWeight = repo.isPersonal ? 0.5 : 1.0;
    
                    const repoScore = contributionPercentage * complexityWeight * typeWeight;
                    totalWeightedScore += repoScore;
                    maxRepoScore = Math.max(maxRepoScore, repoScore); // Cập nhật điểm cao nhất
                    validRepoCount++;
                }
            } catch (error: any) {
                console.error(`Failed to fetch contributors for repo: ${repo.url}`, error.message);
            }
        }
    
        // Trung bình điểm và áp dụng phạt nếu cần
        const averageScore = validRepoCount > 0 ? totalWeightedScore / validRepoCount : 0;
    
        // Quy về thang điểm 100
        const normalizedScore = maxRepoScore > 0 ? (averageScore / maxRepoScore) * 100 : 0;
    
        return normalizedScore * personalRepoPenalty;
    };
    

    public getGitHubScore = async (userId: string, jobPostId: string): Promise<number> => {
        log("userId", userId, "jobPostId", jobPostId);
        const token = await this.candidateRepo.getGithubToken(userId);
        if (!token) {
            log("No GitHub token found for user: " + userId);
            return 0;
        }
        const repos = await this.getAllRepos(token.accessToken as string);
        const jobPost = await this.jobPostRepository.findById(jobPostId);
        const jDLanguages = jobPost?.professionalSkills;
        if (!jDLanguages) {
            log("No job description languages found for job post: " + jobPostId);
            return 0;
        }
        const score = await this.calculateGitHubScore(repos, jDLanguages, token.accessToken as string);
        return score;
    };
}
