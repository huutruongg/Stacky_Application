import { BaseRoutes } from './BaseRoutes';
import JobPostController from '../../src/controllers/JobPostController';
import { authenticateJWT } from '../middlewares/Authenticate';
import { authorizeJWT } from '../middlewares/Authorize';
import { UserRole } from '../../src/enums/EUserRole';
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
        this.router.get("/get-all", cacheMiddleware, this.jobPostController.getAllJobPosts); // Done
        this.router.get("/get-all-by-candidate", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.getJobsByCandidate); // Done
        this.router.get("/get-job-detail/:jobPostId", cacheMiddleware, this.jobPostController.getJobDetail); // Done
        this.router.get("/get-job-detail-by-candidate/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), cacheMiddleware, this.jobPostController.getJobDetailByCandidate);
        this.router.get("/get-job-saved", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.getSavedJobs); // Done
        this.router.get("/get-job-applied", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.getAppliedJobs);  // Done
        this.router.get("/find-job-posts", cacheMiddleware, this.jobPostController.findByCondition); // Done
        this.router.post("/create-job-post", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.RECRUITER), this.jobPostController.createJobPost); // Done
        this.router.delete("/delete-job-post/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.RECRUITER), this.jobPostController.deleteJobPost); // Done
        this.router.post("/create-application/:jobPostId", authenticateJWT, this.jobPostController.createApplication);
        this.router.post("/save-job-post/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.saveJobPost); // Done
        this.router.delete("/unsave-job-post/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.unSaveJobPost); // Done
        this.router.post("/set-apply-status", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.RECRUITER), this.jobPostController.setApplyStatus);
        this.router.get('/get-related-job-posts', cacheMiddleware, this.jobPostController.getRelatedJobPosts); // Done
        this.router.get('/get-job-posts-by-recruiter/:recruiterId', authenticateJWT, cacheMiddleware, this.jobPostController.getJobPostsByRecruiter); // Done
    }
}
