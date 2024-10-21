import axios from "axios";
import { CommitResponse, GitHubCommit, Repo, RepoDetails, Repository } from "../interfaces/IGithub";

export default class GithubService {
    private token = process.env.GITHUB_API_TOKEN || '';

    async fetchUserRepositories(username: string): Promise<Repository[]> {
        const url = `https://api.github.com/users/${username}/repos`;
        const headers = this.getHeaders();
        try {
            const { data } = await axios.get<Repository[]>(url, { headers });
            return data;
        } catch (error: any) {
            console.error(`Error fetching repositories for ${username}:`, error.message);
            return [];
        }
    }

    async fetchCommitCount(repoFullName: string, username: string): Promise<CommitResponse> {
        const url = `https://api.github.com/repos/${repoFullName}/commits?author=${username}`;
        try {
            const { data: commits } = await axios.get<GitHubCommit[]>(url, { headers: this.getHeaders() });
            const featureCommits = commits.filter(commit => /feature|optimize/i.test(commit.commit.message)).length;

            return { commitCount: commits.length, featureCommits };
        } catch (error: any) {
            console.error(`Error fetching commits for ${repoFullName}:`, error.message);
            return { commitCount: 0, featureCommits: 0 };
        }
    }

    async fetchCollaboratedRepositories(repoUrls: string[]): Promise<Repository[]> {
        const headers = this.getHeaders();

        const repos = await Promise.all(repoUrls.map(async url => {
            const repo = url.split('github.com/')[1];
            try {
                const { data } = await axios.get<Repository>(`https://api.github.com/repos/${repo}`, { headers });
                return data;
            } catch (error: any) {
                console.error(`Error fetching repo ${repo}:`, error.message);
                return null;
            }
        }));

        return repos.filter(repo => repo !== null) as Repository[];
    }

    async fetchRepoDetails(repoFullName: string): Promise<RepoDetails> {
        const url = `https://api.github.com/repos/${repoFullName}`;
        console.log(`Fetching details for repo: ${repoFullName}`);

        try {
            const { data } = await axios.get(url, { headers: this.getHeaders() });
            const { stargazers_count, forks_count, watchers_count } = data;

            return {
                stars: stargazers_count || 0,
                forks: forks_count || 0,
                watchers: watchers_count || 0
            };
        } catch (error: any) {
            console.error(`Error fetching repo details:`, error.message);
            return { stars: 0, forks: 0, watchers: 0 };
        }
    }

    private getHeaders() {
        return {
            Authorization: `token ${this.token}`,
            Accept: 'application/vnd.github.v3+json'
        };
    }

    async calculatePopularityScore(stars: number, forks: number, issues: number) {
        let score = 1;
        if (stars > 50) score += 3;
        else if (stars >= 11) score += 2;
        else if (stars >= 1) score += 1;

        if (forks > 10) score += 1;
        if (issues > 5) score += 1;

        return score;
    }

    async calculateCommitScore(
        repoFullName: string,
        username: string,
        repoLanguage: string | null,
        jdLanguages: string[]
    ): Promise<number> {
        const { commitCount, featureCommits } = await this.fetchCommitCount(repoFullName, username);

        if (jdLanguages.includes(repoLanguage || '')) {
            return commitCount * 0.5 + featureCommits * 2;
        }
        return 0;
    }

    async calculateTotalScore(
        repos: Repo[],
        JD_languages: string[],
        username: string
    ): Promise<number> {
        let totalScore = 0;

        for (const repo of repos) {
            const { stars, forks, watchers } = await this.fetchRepoDetails(repo.full_name);

            const popularityScore = await this.calculatePopularityScore(stars, forks, watchers);
            const commitScore = await this.calculateCommitScore(repo.full_name, username, repo.language, JD_languages);

            console.log(`${repo.name}: ${popularityScore + commitScore}, language: ${repo.language}`);
            totalScore += popularityScore + commitScore;
        }

        return totalScore;
    }
}

