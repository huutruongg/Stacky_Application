export interface IContributor {
    login: string;
    contributions: number;
}

export interface IRepo {
    url: string;
    language: string;
    isPersonal: boolean;
    stars: number;
    forks: number;
    watchers: number;
}
