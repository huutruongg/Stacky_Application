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
const console_1 = require("console");
const jobPost_model_1 = require("../../models/jobPost.model");
const jobSaved_model_1 = require("../../models/jobSaved.model");
const application_model_1 = require("../../models/application.model");
const EnumPostStatus_1 = __importDefault(require("../../types/EnumPostStatus"));
const DuplicateApplicationError_1 = require("../../utils/errors/DuplicateApplicationError");
const recruiter_model_1 = require("../../models/recruiter.model");
// Helper function to find by ID
const handleFindById = (Model, id, modelName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Model.findById(id).exec();
        if (!data) {
            console.warn(`${modelName} with ID ${id} not found.`);
        }
        return data;
    }
    catch (error) {
        (0, console_1.log)(`Error fetching ${modelName} by ID:`, error);
        return null;
    }
});
// Helper function to find by recruiterId and postId
const handleFindByRecruiterAndPostId = (recruiterId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPosts = yield jobPost_model_1.JobPost.find({ _id: postId, recruiterId }).exec();
        return jobPosts.length > 0 ? jobPosts : null;
    }
    catch (error) {
        (0, console_1.log)(error);
        return null;
    }
});
// Helper function to find by candidateId
const handleFindByCandidate = (Model, candidateId, field) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Model.find({ candidateId }).populate(field).exec();
        return items.length > 0 ? items.map((item) => item[field]) : null;
    }
    catch (error) {
        (0, console_1.log)(error);
        return null;
    }
});
// Helper function to find by field with regex
const handleFindByField = (Model, fieldName, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First query: Find the matching job posts with selected fields
        const data = yield Model.find({ [fieldName]: { $regex: value, $options: 'i' } })
            .select('jobTitle jobImage jobSalary location recruiterId') // Select only required fields
            .exec();
        if (!data || data.length === 0) {
            return null;
        }
        // Extract recruiterIds
        const recruiterIds = data.map(post => post.recruiterId);
        // Second query: Find the recruiters by recruiterIds to get the orgName
        const recruiters = yield recruiter_model_1.Recruiter.find({ _id: { $in: recruiterIds } })
            .select('orgName') // Select only the orgName
            .exec();
        // Create a recruiterMap to map recruiterId to orgName
        const recruiterMap = recruiters.reduce((map, recruiter) => {
            map[String(recruiter._id)] = recruiter.orgName;
            return map;
        }, {});
        // Merge job post data with the recruiter orgName
        const result = data.map(post => ({
            _id: post._id,
            recruiterId: post.recruiterId,
            jobTitle: post.jobTitle,
            jobImage: post.jobImage,
            jobSalary: post.jobSalary,
            location: post.location,
            orgName: recruiterMap[post.recruiterId.toString()] || 'Unknown'
        }));
        return result;
    }
    catch (error) {
        console.error(`Error fetching by ${fieldName}:`, error);
        return null;
    }
});
// Helper function to delete by ID
const handleDeleteById = (Model, id, modelName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Model.findByIdAndDelete(id).exec();
        return !!result;
    }
    catch (error) {
        (0, console_1.log)(`Error deleting ${modelName} with ID ${id}:`, error);
        return false;
    }
});
// Helper function to save job post for candidate
const handleSaveJobPost = (candidateId, jobSavedId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingJob = yield jobSaved_model_1.JobSaved.findOne({ candidateId, jobSavedId });
        if (existingJob) {
            return false;
        }
        const newSavedJob = new jobSaved_model_1.JobSaved({ candidateId, jobSavedId });
        yield newSavedJob.save();
        return true;
    }
    catch (error) {
        (0, console_1.log)(error);
        return false;
    }
});
const JobManagementService = {
    getJobPostingById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindById(jobPost_model_1.JobPost, id, "JobPost");
    }),
    getJobPostingsByRecruiter: (recruiterId, postId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindByRecruiterAndPostId(recruiterId, postId);
    }),
    getJobsSaved: (candidateId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindByCandidate(jobSaved_model_1.JobSaved, candidateId, "jobPost");
    }),
    getJobsApplied: (candidateId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindByCandidate(application_model_1.Application, candidateId, "jobPost");
    }),
    findJobPostingsByJobPosition: (key) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindByField(jobPost_model_1.JobPost, "jobTitle", key);
    }),
    filterJobPostingByLocation: (location) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindByField(jobPost_model_1.JobPost, "location", location);
    }),
    filterJobPostingByIndustry: (industry) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindByField(jobPost_model_1.JobPost, "typeOfIndustry", industry);
    }),
    getJobsPosted: (recruiterId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const jobPosts = yield jobPost_model_1.JobPost.find({ recruiterId }).exec();
            return jobPosts.length > 0 ? jobPosts : null;
        }
        catch (error) {
            (0, console_1.log)(error);
            return null;
        }
    }),
    getJobPostingsByPage: (page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
        if (page <= 0 || pageSize <= 0) {
            console.warn('Invalid pagination parameters');
            return null;
        }
        try {
            // Perform the two queries concurrently using Promise.all()
            const [jobPosts, recruiters] = yield Promise.all([
                jobPost_model_1.JobPost.find()
                    .select('_id jobTitle jobImage jobSalary location recruiterId')
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec(),
                recruiter_model_1.Recruiter.find()
                    .select('_id orgName')
                    .exec()
            ]);
            if (!jobPosts || jobPosts.length === 0) {
                console.warn('No job posts found');
                return null;
            }
            // Create a recruiterMap with a Map object for better key management
            const recruiterMap = new Map();
            recruiters.forEach(recruiter => {
                recruiterMap.set(String(recruiter._id), recruiter.orgName);
            });
            // Merge the jobPosts with the recruiter orgNames
            const mergedResults = jobPosts.map(post => ({
                _id: post._id,
                recruiterId: post.recruiterId,
                jobTitle: post.jobTitle,
                jobImage: post.jobImage,
                jobSalary: post.jobSalary,
                location: post.location,
                orgName: recruiterMap.get(post.recruiterId.toString()) || 'Unknown' // Handle missing orgName
            }));
            return mergedResults;
        }
        catch (error) {
            console.error('Error fetching job postings by page:', error);
            return null;
        }
    }),
    createJobPosting: (jobPostingDataReq) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield jobPost_model_1.JobPost.create(Object.assign(Object.assign({}, jobPostingDataReq), { postStatus: EnumPostStatus_1.default.PENDING, postedAt: new Date() }));
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }),
    deleteJobPosting: (jobId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleDeleteById(jobPost_model_1.JobPost, jobId, "JobPost");
    }),
    createApplication: (candidateId, jobPostId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingApplication = yield application_model_1.Application.findOne({ candidateId, jobPostId });
            if (existingApplication) {
                throw new DuplicateApplicationError_1.DuplicateApplicationError('Candidate has already applied for this job.');
            }
            const application = new application_model_1.Application({ candidateId, jobPostId });
            yield application.save();
            return true;
        }
        catch (error) {
            (0, console_1.log)(error);
            return false;
        }
    }),
    savedJobPost: (candidateId, jobSavedId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleSaveJobPost(candidateId, jobSavedId);
    }),
    cancelJobPostSaved: (jobSavedId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleDeleteById(jobSaved_model_1.JobSaved, jobSavedId, "JobSaved");
    }),
    setApplyStatus: (applicationId, status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield application_model_1.Application.findByIdAndUpdate(applicationId, { status: status });
            return true;
        }
        catch (error) {
            (0, console_1.log)(error);
            return false;
        }
    }),
    censorJobPost: (jobPostId, status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield jobPost_model_1.JobPost.findByIdAndUpdate(jobPostId, { postStatus: status });
            return true;
        }
        catch (error) {
            (0, console_1.log)(error);
            return false;
        }
    })
};
exports.default = JobManagementService;
