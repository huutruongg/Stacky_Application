import axios from "axios";
import { CommitResponse, GitHubCommit, Repo, RepoDetails, Repository } from "../../types/IGithub";

const GithubService = {
    fetchUserRepositories: async (username: string, token: string): Promise<Repository[]> => {
        const url = `https://api.github.com/users/${username}/repos`;
        const headers = {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        };

        try {
            const { data } = await axios.get<Repository[]>(url, { headers });
            return data;
        } catch (error: any) {
            console.error(`Error fetching repositories for ${username}:`, error.message);
            return [];
        }
    },

    fetchCommitCount: async (repoFullName: string, username: string, token: string): Promise<CommitResponse> => {
        const url = `https://api.github.com/repos/${repoFullName}/commits?author=${username}`;
        try {
            const { data: commits } = await axios.get<GitHubCommit[]>(url, {
                headers: { Authorization: `token ${token}` },
            });

            const featureCommits = commits.filter(commit =>
                /feature|optimize/i.test(commit.commit.message)
            ).length;

            return { commitCount: commits.length, featureCommits };
        } catch (error: any) {
            console.error(`Error fetching commits for ${repoFullName}:`, error.message);
            return { commitCount: 0, featureCommits: 0 };
        }
    },

    fetchCollaboratedRepositories: async (repoUrls: string[], token: string): Promise<Repository[]> => {
        const headers = {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        };

        const repos = await Promise.all(repoUrls.map(async url => {
            const repo = url.split('github.com/')[1];
            try {
                const { data: repoData } = await axios.get<Repository>(`https://api.github.com/repos/${repo}`, { headers });
                return repoData;
            } catch (error: any) {
                console.error(`Error fetching collaborated repo ${url}:`, error.message);
                return null;
            }
        }));

        return repos.filter(repo => repo !== null) as Repository[];
    },

    fetchRepoDetails: async (repoFullName: string, token: string): Promise<RepoDetails> => {
        const url = `https://api.github.com/repos/${repoFullName}`;
        console.log(`Fetching details for repo: ${repoFullName}`); // Dòng log mới thêm vào
        try {
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
    
            const { stargazers_count = 0, forks_count = 0, watchers_count = 0 } = data;
    
            return { stars: stargazers_count, forks: forks_count, watchers: watchers_count };
        } catch (error: any) {
            console.error(`Error fetching repo details for ${repoFullName}:`, error.message);
            return { stars: 0, forks: 0, watchers: 0 };
        }
    }
    
};
const GithubScore = {
    calculatePopularityScore: (stars: number, forks: number, issues: number): number => {
        let score = 1; // Default score for personal repos

        // Score based on star count
        if (stars > 50) score += 3;
        else if (stars >= 11) score += 2;
        else if (stars >= 1) score += 1;

        // Additional points for forks and issues
        if (forks > 10) score += 1;
        if (issues > 5) score += 1;

        return score;
    },

    calculateCommitScore: async (repoFullName: string, username: string, token: string, isSelfCreated: boolean, repoLanguage: string | null, jdLanguages: string[]): Promise<number> => {
        const { commitCount, featureCommits } = await GithubService.fetchCommitCount(repoFullName, username, token);

        if (jdLanguages.includes(repoLanguage || '')) {
            return commitCount * 0.5 + featureCommits * 2; // Base score + feature commit points
        }
        return 0; // Language mismatch
    },

    calculateTotalScore: async (repos: Repo[], JD_languages_required: string[], selfCreatedRepos: string[], username: string, token: string): Promise<number> => {
        let totalScore = 0;

        for (const repo of repos) {
            const isSelfCreated = selfCreatedRepos.includes(repo.name);
            const repoLanguage = repo.language;

            // Check languages
            if (!JD_languages_required.includes(repoLanguage || '')) {
                continue; 
            }

            // Fetch repo details (stars, forks, issues)
            const { stars, forks, watchers } = await GithubService.fetchRepoDetails(repo.full_name, token);
            const score = GithubScore.calculatePopularityScore(stars, forks, watchers);

            const commitScore = await GithubScore.calculateCommitScore(repo.full_name, username, token, isSelfCreated, repoLanguage, JD_languages_required);
            console.log(repo.name + ": " + (score + commitScore) + ", language: " + repoLanguage);

            totalScore += score + commitScore;
        }

        return totalScore;
    }
};

export { GithubService, GithubScore };
