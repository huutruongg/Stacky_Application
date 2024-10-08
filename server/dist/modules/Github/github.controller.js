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
const jobManagement_service_1 = __importDefault(require("../JobManagement/jobManagement.service"));
const getProgrammingLanguages_util_1 = __importDefault(require("../../utils/getProgrammingLanguages.util"));
const github_service_1 = require("./github.service");
const console_1 = require("console");
const GithubController = {
    getGithubScore: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { candidateId, jobId } = req.body;
        (0, console_1.log)(candidateId, jobId);
        try {
            const candidatePromise = candidate_service_1.default.getCandidateById(candidateId);
            const jobDescriptionPromise = jobManagement_service_1.default.getJobPostingById(jobId);
            const [candidateData, jobDescription] = yield Promise.all([candidatePromise, jobDescriptionPromise]);
            if (!candidateData || !jobDescription) {
                res.status(500).json({ success: false, message: "Candidate or Job Description not found" });
                return;
            }
            const candidateLanguages = ((_a = candidateData.programmingSkills) === null || _a === void 0 ? void 0 : _a.split(', ')) || [];
            const jdText = (jobDescription === null || jobDescription === void 0 ? void 0 : jobDescription.professionalSkills) || "";
            if (!jdText) {
                res.status(500).json({ success: false, message: "Job description missing professional skills" });
                return;
            }
            const languages = (0, getProgrammingLanguages_util_1.default)(candidateLanguages, jdText);
            if (!languages || languages.length === 0) {
                res.status(200).json({ success: true, totalScore: 0, message: "No matching languages found" });
                return;
            }
            const selfCreatedRepoUrl = candidateData === null || candidateData === void 0 ? void 0 : candidateData.githubUrl;
            if (!selfCreatedRepoUrl) {
                res.status(500).json({ success: false, message: "Candidate GitHub URL missing or invalid" });
                return;
            }
            const username = selfCreatedRepoUrl.split('github.com/')[1];
            const sharedRepoUrlPromise = candidate_service_1.default.getUrlReposSharedByCandidateId(candidateId);
            const tokenPromise = candidate_service_1.default.getAccessTokenGithub(candidateId);
            const [sharedRepoUrl, token] = yield Promise.all([sharedRepoUrlPromise, tokenPromise]);
            if (!token) {
                res.status(401).json({ success: false, message: "GitHub access token not found" });
                return;
            }
            const selfCreatedReposPromise = github_service_1.GithubService.fetchUserRepositories(username, token);
            let sharedRepos = [];
            if (sharedRepoUrl) {
                try {
                    sharedRepos = yield github_service_1.GithubService.fetchCollaboratedRepositories(sharedRepoUrl, token);
                }
                catch (sharedRepoError) {
                    (0, console_1.log)("Error fetching shared repositories:", sharedRepoError);
                    // If shared repos fail to fetch, continue with personal repos
                }
            }
            const selfCreatedRepos = yield selfCreatedReposPromise;
            const allRepos = [...selfCreatedRepos, ...sharedRepos];
            const totalScore = yield github_service_1.GithubScore.calculateTotalScore(allRepos, languages, selfCreatedRepos.map(repo => repo.full_name), username, token);
            res.json({ success: true, totalScore, allRepos });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "An error occurred while calculating the GitHub score", error: error });
        }
    })
};
exports.default = GithubController;
