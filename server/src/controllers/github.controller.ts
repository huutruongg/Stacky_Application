import { Repo } from './../utils/types/IGithub.d';
import getMatchingLanguages from "../helper/getProgrammingLanguages.help";
import CandidateDataService from "../services/candidateData.service";
import JobPostingService from "../services/jobDescription.service";
import UserService from "../services/user.service";
import { GithubService, GithubScore } from "../services/github.service";
import { Request, Response } from 'express';

const GithubController = {
    getGithubScore: async (req: Request, res: Response): Promise<void> => {
        const { candidate_id, job_id } = req.body;

        try {
            const candidatePromise = UserService.getCandidateById(candidate_id);
            const jobDescriptionPromise = JobPostingService.getJDById(job_id);
            const [candidate, jobDescription] = await Promise.all([candidatePromise, jobDescriptionPromise]);

            if (!candidate || !jobDescription) {
                res.status(404).json({ success: false, message: "Candidate or Job Description not found" });
                return;
            }

            const candidateLanguages: string[] = candidate?.programming_skills?.split(', ') || [];
            const jdText: string = jobDescription?.professional_skills || "";

            if (!jdText) {
                res.status(400).json({ success: false, message: "Job description missing professional skills" });
                return;
            }

            const languages = getMatchingLanguages(candidateLanguages, jdText);
            if (!languages || languages.length === 0) {
                res.status(200).json({ success: true, totalScore: 0, message: "No matching languages found" });
                return;
            }

            const selfCreatedRepoUrl = candidate?.github_url;
            if (!selfCreatedRepoUrl) {
                res.status(400).json({ success: false, message: "Candidate GitHub URL missing or invalid" });
                return;
            }

            const username = selfCreatedRepoUrl.split('github.com/')[1];
            const sharedRepoUrlPromise = CandidateDataService.getUrlReposSharedByCandidateId(candidate_id);
            const tokenPromise = CandidateDataService.getAccessTokenGithub(candidate_id);
            const [sharedRepoUrl, token] = await Promise.all([sharedRepoUrlPromise, tokenPromise]);

            if (!sharedRepoUrl) {
                res.status(400).json({ success: false, message: "No shared repositories found" });
                return;
            }
            if (!token) {
                res.status(401).json({ success: false, message: "GitHub access token not found" });
                return;
            }

            // const selfCreatedRepos = await GithubService.fetchUserRepositories(username, token);
            const [selfCreatedRepos, sharedRepos] = await Promise.all([
                GithubService.fetchUserRepositories(username, token),
                GithubService.fetchCollaboratedRepositories(sharedRepoUrl, token)
            ]);

            const allRepos: Repo[] = [...selfCreatedRepos, ...sharedRepos];

            const totalScore: number = await GithubScore.calculateTotalScore(
                allRepos,
                languages,
                selfCreatedRepos.map(repo => repo.full_name),
                username,
                token
            );

            res.json({ success: true, totalScore, allRepos });

        } catch (error: any) {
            console.error('Error:', error.message);
            res.status(500).json({ success: false, message: "An error occurred while calculating the GitHub score", error: error.message });
        }
    }
};

export default GithubController;
