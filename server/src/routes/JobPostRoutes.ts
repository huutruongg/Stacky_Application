import { BaseRoutes } from './BaseRoutes';
import JobPostController from '../../src/controllers/JobPostController';
import { cacheMiddleware } from '../middlewares/CacheRedis';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import verifyToken from '../middlewares/verifyToken';
import refreshToken from '../middlewares/refreshToken';

export default class JobPostRoutes extends BaseRoutes {
    private jobPostController: JobPostController;

    constructor(jobPostController: JobPostController) {
        super();
        this.jobPostController = jobPostController;
        this.autoBindControllerMethods(this.jobPostController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Public routes
        this.router.get('/get-all', cacheMiddleware, this.jobPostController.getAllJobPosts);
        this.router.get('/find-job-posts', cacheMiddleware, this.jobPostController.findByCondition);
        this.router.get('/get-job-detail/:jobPostId', cacheMiddleware, this.jobPostController.getJobDetail);
        this.router.get('/get-related-job-posts', cacheMiddleware, this.jobPostController.getRelatedJobPosts);
        this.router.get('/get-top-recruiters', cacheMiddleware, this.jobPostController.getTopRecruiters);
        this.router.get('/get-top-job-salaries', cacheMiddleware, this.jobPostController.getTopJobSalaries);
        this.router.get('/get-job-posted-by-recruiter/:recruiterId', cacheMiddleware, this.jobPostController.getJobPostedByRecruiter);

        // Candidate-specific routes
        this.router.get(
            '/get-all-by-candidate',
            verifyToken, refreshToken, authenticate,
            authorize(['getJobsByCandidate']),
            this.jobPostController.getJobsByCandidate
        );
        this.router.get(
            '/get-job-detail-by-candidate/:jobPostId',
            verifyToken, refreshToken, authenticate, authorize(['getJobDetailByCandidate']),
            // cacheMiddleware,
            this.jobPostController.getJobDetailByCandidate
        );
        this.router.get(
            '/get-job-saved',
            verifyToken, refreshToken, authenticate, authorize(['getSavedJobs']),
            this.jobPostController.getSavedJobs
        );
        this.router.get(
            '/get-job-applied',
            verifyToken, refreshToken, authenticate, authorize(['getAppliedJobs']),
            this.jobPostController.getAppliedJobs
        );
        this.router.post(
            '/save-job-post/:jobPostId',
            verifyToken, refreshToken, authenticate, authorize(['saveJobPost']),
            this.jobPostController.saveJobPost
        );
        this.router.delete(
            '/unsave-job-post/:jobPostId',
            verifyToken, refreshToken, authenticate, authorize(['unSaveJobPost']),
            this.jobPostController.unSaveJobPost
        );

        this.router.post(
            '/create-application/:jobPostId',
            verifyToken, refreshToken, authenticate, authorize(['createApplication']),
            this.jobPostController.createApplication
        );

        this.router.delete("/delete-application/:jobPostId/:candidateId",
            verifyToken, refreshToken, authenticate, authorize(['deleteApplication']),
            this.jobPostController.deleteApplication
        );

        // Recruiter/Admin-specific routes
        this.router.post(
            '/create-job-post',
            verifyToken, refreshToken, authenticate, authorize(['createJobPost']),
            this.jobPostController.createJobPost
        );
        this.router.delete(
            '/delete-job-post/:jobPostId',
            verifyToken, refreshToken, authenticate, authorize(['deleteJobPost']),
            this.jobPostController.deleteJobPost
        );
        this.router.post(
            '/set-apply-status',
            verifyToken, refreshToken, authenticate, authorize(['setApplyStatus']),
            this.jobPostController.setApplyStatus
        );
        this.router.get(
            '/get-job-posts-by-recruiter',
            verifyToken, refreshToken, authenticate, authorize(['getJobPostsByRecruiter']),
            this.jobPostController.getJobPostsByRecruiter
        );
    }
}
