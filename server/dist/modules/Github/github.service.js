"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubScore = exports.GithubService = void 0;
const axios_1 = __importDefault(require("axios"));
const GithubService = {
    fetchUserRepositories: (username, token) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://api.github.com/users/${username}/repos`;
        const headers = {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        };
        try {
            const { data } = yield axios_1.default.get(url, { headers });
            return data;
        }
        catch (error) {
            console.error(`Error fetching repositories for ${username}:`, error.message);
            return [];
        }
    }),
    fetchCommitCount: (repoFullName, username, token) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://api.github.com/repos/${repoFullName}/commits?author=${username}`;
        try {
            const { data: commits } = yield axios_1.default.get(url, {
                headers: { Authorization: `token ${token}` },
            });
            const featureCommits = commits.filter(commit => /feature|optimize/i.test(commit.commit.message)).length;
            return { commitCount: commits.length, featureCommits };
        }
        catch (error) {
            console.error(`Error fetching commits for ${repoFullName}:`, error.message);
            return { commitCount: 0, featureCommits: 0 };
        }
    }),
    fetchCollaboratedRepositories: (repoUrls, token) => __awaiter(void 0, void 0, void 0, function* () {
        const headers = {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        };
        const repos = yield Promise.all(repoUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
            const repo = url.split('github.com/')[1];
            try {
                const { data: repoData } = yield axios_1.default.get(`https://api.github.com/repos/${repo}`, { headers });
                return repoData;
            }
            catch (error) {
                console.error(`Error fetching collaborated repo ${url}:`, error.message);
                return null;
            }
        })));
        return repos.filter(repo => repo !== null);
    }),
    fetchRepoDetails: (repoFullName, token) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://api.github.com/repos/${repoFullName}`;
        console.log(`Fetching details for repo: ${repoFullName}`); // Dòng log mới thêm vào
        try {
            const { data } = yield axios_1.default.get(url, {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            const { stargazers_count = 0, forks_count = 0, watchers_count = 0 } = data;
            return { stars: stargazers_count, forks: forks_count, watchers: watchers_count };
        }
        catch (error) {
            console.error(`Error fetching repo details for ${repoFullName}:`, error.message);
            return { stars: 0, forks: 0, watchers: 0 };
        }
    })
};
exports.GithubService = GithubService;
const GithubScore = {
    calculatePopularityScore: (stars, forks, issues) => {
        let score = 1; // Default score for personal repos
        // Score based on star count
        if (stars > 50)
            score += 3;
        else if (stars >= 11)
            score += 2;
        else if (stars >= 1)
            score += 1;
        // Additional points for forks and issues
        if (forks > 10)
            score += 1;
        if (issues > 5)
            score += 1;
        return score;
    },
    calculateCommitScore: (repoFullName, username, token, isSelfCreated, repoLanguage, jdLanguages) => __awaiter(void 0, void 0, void 0, function* () {
        const { commitCount, featureCommits } = yield GithubService.fetchCommitCount(repoFullName, username, token);
        if (jdLanguages.includes(repoLanguage || '')) {
            return commitCount * 0.5 + featureCommits * 2; // Base score + feature commit points
        }
        return 0; // Language mismatch
    }),
    calculateTotalScore: (repos, JD_languages_required, selfCreatedRepos, username, token) => __awaiter(void 0, void 0, void 0, function* () {
        let totalScore = 0;
        for (const repo of repos) {
            const isSelfCreated = selfCreatedRepos.includes(repo.name);
            const repoLanguage = repo.language;
            // Check languages
            if (!JD_languages_required.includes(repoLanguage || '')) {
                continue;
            }
            // Fetch repo details (stars, forks, issues)
            const { stars, forks, watchers } = yield GithubService.fetchRepoDetails(repo.full_name, token);
            const score = GithubScore.calculatePopularityScore(stars, forks, watchers);
            const commitScore = yield GithubScore.calculateCommitScore(repo.full_name, username, token, isSelfCreated, repoLanguage, JD_languages_required);
            console.log(repo.name + ": " + (score + commitScore) + ", language: " + repoLanguage);
            totalScore += score + commitScore;
        }
        return totalScore;
    })
};
exports.GithubScore = GithubScore;
