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
const candidate_service_1 = __importDefault(require("../Candidate/candidate.service"));
const jobPosting_service_1 = __importDefault(require("../JobPosting/jobPosting.service"));
const getProgrammingLanguages_util_1 = __importDefault(require("../../utils/getProgrammingLanguages.util"));
const github_service_1 = require("./github.service");
const GithubController = {
    getGithubScore: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { candidate_id, job_id } = req.body;
        try {
            const candidatePromise = candidate_service_1.default.getCandidateById(candidate_id);
            const jobDescriptionPromise = jobPosting_service_1.default.getJDById(job_id);
            const [candidate, jobDescription] = yield Promise.all([candidatePromise, jobDescriptionPromise]);
            if (!candidate || !jobDescription) {
                res.status(404).json({ success: false, message: "Candidate or Job Description not found" });
                return;
            }
            const candidateLanguages = ((_a = candidate === null || candidate === void 0 ? void 0 : candidate.programming_skills) === null || _a === void 0 ? void 0 : _a.split(', ')) || [];
            const jdText = (jobDescription === null || jobDescription === void 0 ? void 0 : jobDescription.professional_skills) || "";
            if (!jdText) {
                res.status(400).json({ success: false, message: "Job description missing professional skills" });
                return;
            }
            const languages = (0, getProgrammingLanguages_util_1.default)(candidateLanguages, jdText);
            if (!languages || languages.length === 0) {
                res.status(200).json({ success: true, totalScore: 0, message: "No matching languages found" });
                return;
            }
            const selfCreatedRepoUrl = candidate === null || candidate === void 0 ? void 0 : candidate.github_url;
            if (!selfCreatedRepoUrl) {
                res.status(400).json({ success: false, message: "Candidate GitHub URL missing or invalid" });
                return;
            }
            const username = selfCreatedRepoUrl.split('github.com/')[1];
            const sharedRepoUrlPromise = candidate_service_1.default.getUrlReposSharedByCandidateId(candidate_id);
            const tokenPromise = candidate_service_1.default.getAccessTokenGithub(candidate_id);
            const [sharedRepoUrl, token] = yield Promise.all([sharedRepoUrlPromise, tokenPromise]);
            if (!sharedRepoUrl) {
                res.status(400).json({ success: false, message: "No shared repositories found" });
                return;
            }
            if (!token) {
                res.status(401).json({ success: false, message: "GitHub access token not found" });
                return;
            }
            // const selfCreatedRepos = await GithubService.fetchUserRepositories(username, token);
            const [selfCreatedRepos, sharedRepos] = yield Promise.all([
                github_service_1.GithubService.fetchUserRepositories(username, token),
                github_service_1.GithubService.fetchCollaboratedRepositories(sharedRepoUrl, token)
            ]);
            const allRepos = [...selfCreatedRepos, ...sharedRepos];
            const totalScore = yield github_service_1.GithubScore.calculateTotalScore(allRepos, languages, selfCreatedRepos.map(repo => repo.full_name), username, token);
            res.json({ success: true, totalScore, allRepos });
        }
        catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ success: false, message: "An error occurred while calculating the GitHub score", error: error.message });
        }
    })
};
exports.default = GithubController;
