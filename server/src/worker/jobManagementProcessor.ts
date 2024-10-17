import { log } from 'console';
import JobManagementController from '../modules/JobManagement/jobManagement.controller';
import { Request, Response } from 'express';

export const jobManagementProcessor = async (req: Request, res: Response) => {
  switch (true) {
    // Specific routes with parameters come first
    case req.url.includes('/delete-job-posting/') && req.method === 'DELETE':
      await JobManagementController.deleteJobPosting(req, res);
      break;

    case req.url.includes('/create-application/') && req.method === 'POST':
      await JobManagementController.createApplication(req, res);
      break;

    case req.url.includes('/save-job/') && req.method === 'POST':
      await JobManagementController.savedJobPost(req, res);
      break;

    case req.url.includes('/cancel-job-saved/') && req.method === 'DELETE':
      await JobManagementController.cancelJobPostSaved(req, res);
      break;

    // More general routes come later
    case req.url.includes('/job-postings') && req.method === 'GET':
      await JobManagementController.getJobPostings(req, res);
      break;

    case req.url.includes('/job-posting') && req.method === 'GET':
      await JobManagementController.getJobPosting(req, res);
      break;

    case req.url.includes('/job-saved') && req.method === 'GET':
      await JobManagementController.getJobPostingsSaved(req, res);
      break;

    case req.url.includes('/job-applied') && req.method === 'GET':
      await JobManagementController.getJobsApplied(req, res);
      break;

    case req.url.includes('/search-job-postings') && req.method === 'GET':
      await JobManagementController.findByJobPosition(req, res);
      break;

    // case req.url.includes('/filter-by-location') && req.method === 'GET':
    //   await JobManagementController.filterByLocation(req, res);
    //   break;

    // case req.url.includes('/filter-by-industry') && req.method === 'GET':
    //   await JobManagementController.filterByIndustry(req, res);
    //   break;

    case req.url.includes('/create-job-posting') && req.method === 'POST':
      await JobManagementController.createJobPosting(req, res);
      break;

    case req.url.includes('/set-apply-status') && req.method === 'POST':
      await JobManagementController.setApplyStatus(req, res);
      break;

    case req.url.includes('/censor-job-post') && req.method === 'POST':
      await JobManagementController.censorJobPost(req, res);
      break;

    default:
      throw new Error('No matching job management route found!');
  }
};
