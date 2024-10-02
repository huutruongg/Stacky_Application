import { Router } from "express";
import JobManagementController from "../modules/JobManagement/jobManagement.controller";
import authenticateJWT from "../middlewares/authenticate.m";
import authorize from "../middlewares/authorize.m";
import UserRole from "../types/EnumUserRole";

const router = Router();

router.get('/job-postings', JobManagementController.getJobPostings);
router.get('/job-posting/:id', JobManagementController.getJobPosting);
router.get('/job-saved', JobManagementController.getJobPostingsSaved);
router.get('/job-applied', JobManagementController.getJobsApplied);
router.get('/search-job-postings', JobManagementController.findByJobPosition);
router.get('/filter-by-location', JobManagementController.filterByLocation);
router.get('/filter-by-industry', JobManagementController.filterByIndustry);
router.post('/create-job-posting', JobManagementController.createJobPosting);
router.delete('/delete-job-posting/:jobId', JobManagementController.deleteJobPosting);


// create application and save job post
router.post('/create-application/:jobPostId', JobManagementController.createApplication);
router.post('/save-job/:jobPostId', JobManagementController.savedJobPost);
router.delete('/cancel-job-saved/:jobSavedId', JobManagementController.cancelJobPostSaved)

export default router;