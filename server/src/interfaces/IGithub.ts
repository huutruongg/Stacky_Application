export interface CommitResponse {
    commitCount: number;
    featureCommits: number;
}

export interface GitHubCommit {
    commit: {
        message: string;
    };
}

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string | null;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
}

export interface Repo {
    name: string;
    full_name: string;
    language: string | null;
}

export interface RepoDetails {
    stars: number;
    forks: number;
    watchers: number;
}