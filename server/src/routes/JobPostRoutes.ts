import { BaseRoutes } from './BaseRoutes';
import JobPostController from '../../src/controllers/JobPostController';
import { authenticateJWT } from '../../src/middlewares/AuthenticateMiddleware';
import { authorizeJWT } from '../../src/middlewares/AuthorizeMiddleware';
import { UserRole } from '../../src/enums/EUserRole';

export default class JobPostRoutes extends BaseRoutes {
    private jobPostController: JobPostController;

    constructor(jobPostController: JobPostController) {
        super();
        this.jobPostController = jobPostController;
        this.autoBindControllerMethods(this.jobPostController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/get-all", authenticateJWT, this.jobPostController.getAllJobPosts);
        this.router.get("/get-all-by-candidate", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.getJobsByCandidate);
        this.router.get("/get-job-detail/:jobPostId", authenticateJWT, this.jobPostController.getJobDetail);
        this.router.get("/get-job-detail-by-candidate/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.getJobDetailByCandidate);
        this.router.get("/get-job-saved", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.getSavedJobs);
        this.router.get("/get-job-applied", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.getAppliedJobs);
        this.router.get("/find-job-posts", this.jobPostController.findByCondition);

        this.router.post("/create-job-post", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.RECRUITER), this.jobPostController.createJobPost);
        this.router.delete("/delete-job-post/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.RECRUITER), this.jobPostController.deleteJobPost);

        this.router.post("/create-application/:jobPostId", authenticateJWT, this.jobPostController.createApplication);
        this.router.post("/save-job-post/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.saveJobPost);
        this.router.delete("/unsave-job-post/:jobPostId", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.CANDIDATE), this.jobPostController.unSaveJobPost);

        this.router.post("/set-apply-status", authenticateJWT, authorizeJWT(UserRole.ADMIN, UserRole.RECRUITER), this.jobPostController.setApplyStatus);
        this.router.post("/censor-job-post", authenticateJWT, authorizeJWT(UserRole.ADMIN), this.jobPostController.censorJobPost);
    }
}
