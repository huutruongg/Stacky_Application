import { Request, Response } from 'express';
import CandidateService from '../Candidate/candidate.service';
import JobPostingService from '../JobManagement/jobManagement.service';
import getMatchingLanguages from '../../utils/getProgrammingLanguages.util';
import { GithubScore, GithubService } from './github.service';
import { Repo } from '../../types/IGithub';
import { log } from 'console';

const GithubController = {
    getGithubScore: async (req: Request, res: Response): Promise<void> => {
        const { candidateId, jobId } = req.body;
        log(candidateId, jobId)
        try {
            const candidatePromise = CandidateService.getCandidateById(candidateId);
            const jobDescriptionPromise = JobPostingService.getJobPostingById(jobId);
            const [candidateData, jobDescription] = await Promise.all([candidatePromise, jobDescriptionPromise]);

            if (!candidateData || !jobDescription) {
                res.status(500).json({ success: false, message: "Candidate or Job Description not found" });
                return;
            }

            const candidateLanguages: string[] = candidateData.programmingSkills?.split(', ') || [];
            const jdText: string = jobDescription?.professionalSkills || "";

            if (!jdText) {
                res.status(500).json({ success: false, message: "Job description missing professional skills" });
                return;
            }

            const languages = getMatchingLanguages(candidateLanguages, jdText);
            if (!languages || languages.length === 0) {
                res.status(200).json({ success: true, totalScore: 0, message: "No matching languages found" });
                return;
            }

            const selfCreatedRepoUrl = candidateData?.githubUrl;
            if (!selfCreatedRepoUrl) {
                res.status(500).json({ success: false, message: "Candidate GitHub URL missing or invalid" });
                return;
            }

            const username = selfCreatedRepoUrl.split('github.com/')[1];
            const sharedRepoUrlPromise = CandidateService.getUrlReposSharedByCandidateId(candidateId);
            const tokenPromise = CandidateService.getAccessTokenGithub(candidateId);
            const [sharedRepoUrl, token] = await Promise.all([sharedRepoUrlPromise, tokenPromise]);

            if (!token) {
                res.status(401).json({ success: false, message: "GitHub access token not found" });
                return;
            }

            const selfCreatedReposPromise = GithubService.fetchUserRepositories(username, token);
            let sharedRepos: Repo[] = [];

            if (sharedRepoUrl) {
                try {
                    sharedRepos = await GithubService.fetchCollaboratedRepositories(sharedRepoUrl, token);
                } catch (sharedRepoError) {
                    log("Error fetching shared repositories:", sharedRepoError);
                    // If shared repos fail to fetch, continue with personal repos
                }
            }

            const selfCreatedRepos = await selfCreatedReposPromise;
            const allRepos: Repo[] = [...selfCreatedRepos, ...sharedRepos];

            const totalScore: number = await GithubScore.calculateTotalScore(
                allRepos,
                languages,
                selfCreatedRepos.map(repo => repo.full_name),
                username,
                token
            );

            res.json({ success: true, totalScore, allRepos });

        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "An error occurred while calculating the GitHub score", error: error });
        }
    }
};

export default GithubController;
