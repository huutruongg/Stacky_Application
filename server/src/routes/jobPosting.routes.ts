import { Router } from "express";
import JobController from "../modules/JobPosting/jobPosting.controller";

const router = Router();

router.get('/job-postings', JobController.getJobPostings)
router.get('/job-posting/:id', JobController.getJobPosting)
router.get('/job-saved', JobController.getJobPostingSaved)
router.get('/job-applied', JobController.getJobsApplied)
router.get('/search-job-postings', JobController.findByJobPosition)
router.post('/create-job-posting', JobController.createJobPosting)
router.delete('/delete-job-posting', JobController.deleteJobPosting)


export default router;