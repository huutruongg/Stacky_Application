// import axios from "axios";
// import { CommitResponse, GitHubCommit, Repo, RepoDetails, Repository } from "../interfaces/IGithub";

// export default class GithubService {
//     private token = process.env.GITHUB_API_TOKEN || '';

//     async fetchUserRepositories(username: string): Promise<Repository[]> {
//         const url = `https://api.github.com/users/${username}/repos`;
//         const headers = this.getHeaders();
//         try {
//             const { data } = await axios.get<Repository[]>(url, { headers });
//             return data;
//         } catch (error: any) {
//             console.error(`Error fetching repositories for ${username}:`, error.message);
//             return [];
//         }
//     }

//     async fetchCommitCount(repoFullName: string, username: string): Promise<CommitResponse> {
//         const url = `https://api.github.com/repos/${repoFullName}/commits?author=${username}`;
//         try {
//             const { data: commits } = await axios.get<GitHubCommit[]>(url, { headers: this.getHeaders() });
//             const featureCommits = commits.filter(commit => /feature|optimize/i.test(commit.commit.message)).length;

//             return { commitCount: commits.length, featureCommits };
//         } catch (error: any) {
//             console.error(`Error fetching commits for ${repoFullName}:`, error.message);
//             return { commitCount: 0, featureCommits: 0 };
//         }
//     }

//     async fetchCollaboratedRepositories(repoUrls: string[]): Promise<Repository[]> {
//         const headers = this.getHeaders();

//         const repos = await Promise.all(repoUrls.map(async url => {
//             const repo = url.split('github.com/')[1];
//             try {
//                 const { data } = await axios.get<Repository>(`https://api.github.com/repos/${repo}`, { headers });
//                 return data;
//             } catch (error: any) {
//                 console.error(`Error fetching repo ${repo}:`, error.message);
//                 return null;
//             }
//         }));

//         return repos.filter(repo => repo !== null) as Repository[];
//     }

//     async fetchRepoDetails(repoFullName: string): Promise<RepoDetails> {
//         const url = `https://api.github.com/repos/${repoFullName}`;
//         console.log(`Fetching details for repo: ${repoFullName}`);

//         try {
//             const { data } = await axios.get(url, { headers: this.getHeaders() });
//             const { stargazers_count, forks_count, watchers_count } = data;

//             return {
//                 stars: stargazers_count || 0,
//                 forks: forks_count || 0,
//                 watchers: watchers_count || 0
//             };
//         } catch (error: any) {
//             console.error(`Error fetching repo details:`, error.message);
//             return { stars: 0, forks: 0, watchers: 0 };
//         }
//     }

//     private getHeaders() {
//         return {
//             Authorization: `token ${this.token}`,
//             Accept: 'application/vnd.github.v3+json'
//         };
//     }

//     async calculatePopularityScore(stars: number, forks: number, issues: number) {
//         let score = 1;
//         if (stars > 50) score += 3;
//         else if (stars >= 11) score += 2;
//         else if (stars >= 1) score += 1;

//         if (forks > 10) score += 1;
//         if (issues > 5) score += 1;

//         return score;
//     }

//     async calculateCommitScore(
//         repoFullName: string,
//         username: string,
//         repoLanguage: string | null,
//         jdLanguages: string[]
//     ): Promise<number> {
//         const { commitCount, featureCommits } = await this.fetchCommitCount(repoFullName, username);

//         if (jdLanguages.includes(repoLanguage || '')) {
//             return commitCount * 0.5 + featureCommits * 2;
//         }
//         return 0;
//     }

//     async calculateTotalScore(
//         repos: Repo[],
//         JD_languages: string[],
//         username: string
//     ): Promise<number> {
//         let totalScore = 0;

//         for (const repo of repos) {
//             const { stars, forks, watchers } = await this.fetchRepoDetails(repo.full_name);

//             const popularityScore = await this.calculatePopularityScore(stars, forks, watchers);
//             const commitScore = await this.calculateCommitScore(repo.full_name, username, repo.language, JD_languages);

//             console.log(`${repo.name}: ${popularityScore + commitScore}, language: ${repo.language}`);
//             totalScore += popularityScore + commitScore;
//         }

//         return totalScore;
//     }
// }


import axios from "axios";
import { log } from "console";
import CandidateRepository from "../repositories/CandidateRepository";
import JobPostRepository from "../repositories/JobPostRepository";

// Define types for the response data
interface Contributor {
    login: string;
    contributions: number;
}

export default class GithubService {
    private candidateRepo: CandidateRepository;
    private jobPostRepository: JobPostRepository;
    constructor() {
        this.candidateRepo = new CandidateRepository();
        this.jobPostRepository = new JobPostRepository();
    }

    private getAllRepos = async (token: string): Promise<{ url: string; language: string }[]> => {
        const headers = {
            Authorization: `token ${token}`,
        };
        const repos: { url: string; language: string }[] = [];
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
                // Add repo URL and language to the array
                repoData.forEach((repo: any) => {
                    repos.push({ url: repo.url, language: repo.language || "Unknown" });
                });
                page++;
            }
        } catch (error: any) {
            console.error("Failed to fetch repositories:", error.message);
        }
        return repos;
    };

    public calculateGitHubScore = async (
        repos: { url: string; language: string }[],
        JD_languages: string,
        token: string
    ): Promise<number> => {
        const headers = {
            Authorization: `token ${token}`,
        };
        // Fetch the username from GitHub API
        const userResponse = await axios.get("https://api.github.com/user", { headers });
        const username = userResponse.data.login;
        let totalContributionPercentage = 0; // Tổng phần trăm đóng góp của user
        let validRepoCount = 0; // Số repository hợp lệ (trong JD_languages)
        // Filter repos by JD_languages
        const filteredRepos = repos.filter((repo) => JD_languages.includes(repo.language));
        for (const repo of filteredRepos) {
            try {
                // Get contributors data from each repo
                const response = await axios.get<Contributor[]>(`${repo.url}/contributors`, { headers });
                const contributors = response.data;
                // Calculate total contributions in the repo
                const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
                // Find contributions for the authenticated user
                const userContributions = contributors.find((contributor) => contributor.login === username)?.contributions || 0;
                if (totalContributions > 0) {
                    // Calculate the user's contribution percentage for this repo
                    const contributionPercentage = (userContributions / totalContributions) * 100;
                    // Accumulate the contribution percentage
                    totalContributionPercentage += contributionPercentage;
                    validRepoCount++;
                }
            } catch (error: any) {
                console.error(`Failed to fetch contributors for repo: ${repo.url}`, error.message);
            }
        }
        // Calculate the average contribution percentage across all valid repositories
        const averageContributionPercentage = validRepoCount > 0 ? totalContributionPercentage / validRepoCount : 0;
        // Cap the score at 100
        return Math.min(averageContributionPercentage, 100);
    };

    public getGitHubScore = async (userId: string, jobPostId: string): Promise<number> => {
        log("userId", userId, "jobPostId", jobPostId);
        const token = await this.candidateRepo.getGithubToken(userId);
        if (!token) {
            log("No GitHub token found for user: " + userId);
            return 0;
        }
        const urlRepos = await this.getAllRepos(token.accessToken as string);
        const jobPost = await this.jobPostRepository.findById(jobPostId);
        const jDLanguages = jobPost?.professionalSkills || "";
        const score = await this.calculateGitHubScore(urlRepos, jDLanguages, token.accessToken as string);
        return score;
    }
}