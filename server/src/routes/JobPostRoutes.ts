import { BaseRoutes } from './BaseRoutes';
import JobPostController from '../../src/controllers/JobPostController';
import { authenticateJWT } from '../middlewares/Authenticate';
import { authorize } from '../middlewares/Authorize';
import { cacheMiddleware } from '../middlewares/CacheRedis';

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

        // Candidate-specific routes
        this.router.get(
            '/get-all-by-candidate',
            authenticateJWT,
            authorize(['job-post:read']),
            this.jobPostController.getJobsByCandidate
        );
        this.router.get(
            '/get-job-detail-by-candidate/:jobPostId',
            authenticateJWT,
            authorize(['job-post:read']),
            cacheMiddleware,
            this.jobPostController.getJobDetailByCandidate
        );
        this.router.get(
            '/get-job-saved',
            authenticateJWT,
            authorize(['job-post:read']),
            this.jobPostController.getSavedJobs
        );
        this.router.get(
            '/get-job-applied',
            authenticateJWT,
            authorize(['job-post:read']),
            this.jobPostController.getAppliedJobs
        );
        this.router.post(
            '/save-job-post/:jobPostId',
            authenticateJWT,
            authorize(['job-post:write']),
            this.jobPostController.saveJobPost
        );
        this.router.delete(
            '/unsave-job-post/:jobPostId',
            authenticateJWT,
            authorize(['job-post:write']),
            this.jobPostController.unSaveJobPost
        );
        this.router.post(
            '/create-application/:jobPostId',
            authenticateJWT,
            authorize(['job-post:apply']),
            this.jobPostController.createApplication
        );

        // Recruiter/Admin-specific routes
        this.router.post(
            '/create-job-post',
            authenticateJWT,
            authorize(['job-post:write']),
            this.jobPostController.createJobPost
        );
        this.router.delete(
            '/delete-job-post/:jobPostId',
            authenticateJWT,
            authorize(['job-post:delete']),
            this.jobPostController.deleteJobPost
        );
        this.router.post(
            '/set-apply-status',
            authenticateJWT,
            authorize(['job-post:update']),
            this.jobPostController.setApplyStatus
        );
        this.router.get(
            '/get-job-posts-by-recruiter',
            authenticateJWT,
            authorize(['job-post:owner-read']),
            this.jobPostController.getJobPostsByRecruiter
        );
    }
}
