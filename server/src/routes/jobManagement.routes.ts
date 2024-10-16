import { Router } from "express";
import JobManagementController from "../modules/JobManagement/jobManagement.controller";
import authenticateJWT from "../middlewares/authenticate.m";
import UserRole from "../types/EnumUserRole";

const router = Router();

router.get("/job-postings", JobManagementController.getJobPostings);
router.get("/get-jobs-by-candidate/:userId", JobManagementController.getCandidateJobs);
router.get("/job-posting/:jobPostId", JobManagementController.getJobPosting);
router.get("/job-detail/:userId/:jobPostId", JobManagementController.getJobDetail);

router.get("/job-saved/:userId", JobManagementController.getJobPostingsSaved);
router.get("/job-applied", JobManagementController.getJobsApplied);
router.get("/search-job-postings", JobManagementController.findByJobPosition);
// router.get("/filter-by-location", JobManagementController.filterByLocation);
// router.get("/filter-by-industry", JobManagementController.filterByIndustry);
// router.get('/get-jobs-posted/:recruiterId', JobManagementController.getJobsPosted)
router.post("/create-job-posting", JobManagementController.createJobPosting);
router.delete("/delete-job-posting/:jobPostId", JobManagementController.deleteJobPosting);

// create application and save job post
router.post("/create-application/:jobPostId", JobManagementController.createApplication);
router.post("/save-job", JobManagementController.savedJobPost);
router.delete("/cancel-job-saved/:userId/:jobSavedId", JobManagementController.cancelJobPostSaved);

// Set status
router.post("/set-apply-status", JobManagementController.setApplyStatus);
router.post("/censor-job-post", JobManagementController.censorJobPost);
export default router;
