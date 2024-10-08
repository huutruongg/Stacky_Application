"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobManagement_controller_1 = __importDefault(require("../modules/JobManagement/jobManagement.controller"));
const router = (0, express_1.Router)();
router.get('/job-postings', jobManagement_controller_1.default.getJobPostings);
router.get('/job-posting/:jobPostId', jobManagement_controller_1.default.getJobPosting);
router.get('/job-saved', jobManagement_controller_1.default.getJobPostingsSaved);
router.get('/job-applied', jobManagement_controller_1.default.getJobsApplied);
router.get('/search-job-postings', jobManagement_controller_1.default.findByJobPosition);
router.get('/filter-by-location', jobManagement_controller_1.default.filterByLocation);
router.get('/filter-by-industry', jobManagement_controller_1.default.filterByIndustry);
// router.get('/get-jobs-posted/:recruiterId', JobManagementController.getJobsPosted)
router.post('/create-job-posting', jobManagement_controller_1.default.createJobPosting);
router.delete('/delete-job-posting/:jobPostId', jobManagement_controller_1.default.deleteJobPosting);
// create application and save job post
router.post('/create-application/:jobPostId', jobManagement_controller_1.default.createApplication);
router.post('/save-job/:jobPostId', jobManagement_controller_1.default.savedJobPost);
router.delete('/cancel-job-saved/:jobSavedId', jobManagement_controller_1.default.cancelJobPostSaved);
// Set status
router.post('/set-apply-status', jobManagement_controller_1.default.setApplyStatus);
router.post('/censor-job-post', jobManagement_controller_1.default.censorJobPost);
exports.default = router;
