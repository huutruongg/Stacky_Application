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
const jobManagement_service_1 = __importDefault(require("./jobManagement.service"));
const console_1 = require("console");
const jobManagement_validation_1 = __importDefault(require("../../utils/validations/jobManagement.validation"));
const DuplicateApplicationError_1 = require("../../utils/errors/DuplicateApplicationError");
const JobManagementController = {
    getJobPostings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.pageSchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { page, pageSize } = req.query;
            const result = yield jobManagement_service_1.default.getJobPostingsByPage(Number(page), Number(pageSize));
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    getJobPostingsByRecruiter: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.recruiterIdPostIdSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { recruiterId, postId } = req.body;
            const result = yield jobManagement_service_1.default.getJobPostingsByRecruiter(recruiterId, postId);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    getJobPostingsSaved: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.candidateIdSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { candidateId } = req.body;
            const result = yield jobManagement_service_1.default.getJobsSaved(candidateId);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    getJobsApplied: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.candidateIdSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { candidateId } = req.body;
            const result = yield jobManagement_service_1.default.getJobsApplied(candidateId);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    getJobPosting: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { jobPostId } = req.params;
            const result = yield jobManagement_service_1.default.getJobPostingById(jobPostId);
            if (!result) {
                res.status(404).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    findByJobPosition: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.findByJobPositionSchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { keySearch } = req.query;
            const result = yield jobManagement_service_1.default.findJobPostingsByJobPosition(keySearch);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    filterByLocation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.filterByLocationSchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { locationSelection } = req.query;
            const result = yield jobManagement_service_1.default.filterJobPostingByLocation(locationSelection);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    filterByIndustry: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.filterByIndustrySchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { industrySelection } = req.query;
            const result = yield jobManagement_service_1.default.filterJobPostingByIndustry(industrySelection);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    createJobPosting: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.createJobPostingSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const jobPostingData = req.body;
            const isCreated = yield jobManagement_service_1.default.createJobPosting(jobPostingData);
            if (!isCreated) {
                res.status(404).json({ success: false, message: "Job not created!" });
                return;
            }
            res.status(200).json({ success: true, message: 'Created successfully!' });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    deleteJobPosting: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { jobPostId } = req.params;
            const isDeleted = yield jobManagement_service_1.default.deleteJobPosting(jobPostId);
            if (!isDeleted) {
                res.status(404).json({ success: false, message: "Job not deleted!" });
                return;
            }
            res.status(200).json({ success: true, message: 'Deleted successfully!' });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    createApplication: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { candidateId } = req.body;
            const { jobPostId } = req.params;
            const result = yield jobManagement_service_1.default.createApplication(candidateId, jobPostId);
            if (!result) {
                res.status(404).json({ success: false, message: "Failed to create application." });
                return;
            }
            res.status(200).json({ success: true, message: "Application created successfully." });
        }
        catch (error) {
            if (error instanceof DuplicateApplicationError_1.DuplicateApplicationError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            else {
                (0, console_1.log)(error);
                res.status(500).json({ success: false, message: "Internal Server Error!" });
                return;
            }
        }
    }),
    savedJobPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { candidateId } = req.body;
            const { jobPostId } = req.params;
            const isSaved = yield jobManagement_service_1.default.savedJobPost(candidateId, jobPostId);
            if (!isSaved) {
                res.status(404).json({ success: false, message: 'Job post has already been saved by this candidate.' });
                return;
            }
            res.status(200).json({ success: true, message: 'Job post saved successfully!' });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    cancelJobPostSaved: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = jobManagement_validation_1.default.jobSavedIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const { jobSavedId } = req.params;
            const isDeleted = yield jobManagement_service_1.default.cancelJobPostSaved(jobSavedId);
            if (!isDeleted) {
                res.status(404).json({ success: false, message: 'Job post was not found or already removed from saved list.' });
                return;
            }
            res.status(200).json({ success: true, message: 'Job post removed from saved list successfully.' });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    setApplyStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { applicationId, status } = req.body;
            const { error } = jobManagement_validation_1.default.ApplyStatusSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const isSet = yield jobManagement_service_1.default.setApplyStatus(applicationId, status);
            if (!isSet) {
                res.status(404).json({ success: false, message: 'Set status failed.' });
                return;
            }
            res.status(200).json({ success: true, message: 'Set status successfully.' });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }),
    censorJobPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { jobPostId, status } = req.body;
            const { error } = jobManagement_validation_1.default.JobPostStatusSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }
            const isSet = yield jobManagement_service_1.default.censorJobPost(jobPostId, status);
            if (!isSet) {
                res.status(404).json({ success: false, message: 'Set status failed.' });
                return;
            }
            res.status(200).json({ success: true, message: 'Set status successfully.' });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    })
};
exports.default = JobManagementController;
