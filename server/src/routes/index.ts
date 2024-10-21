import { Router, Request, Response, NextFunction } from "express";
// Config
import { config } from "../../src/config/Payment";
// Repositories
import CandidateRepository from "../../src/repositories/CandidateRepository";
import RecruiterRepository from "../../src/repositories/RecruiterRepository";
import UserRepository from "../../src/repositories/UserRepository";
import JobPostRepository from "../../src/repositories/JobPostRepository";
import ApplicantRepository from "../../src/repositories/ApplicantRepository";
// Controllers
import CandidateController from "../../src/controllers/CandidateController";
import AuthController from "../../src/controllers/AuthController";
import RecruiterController from "../../src/controllers/RecruiterController";
import GithubController from "../../src/controllers/GitHubController";
import JobPostController from "../../src/controllers/JobPostController";
import UploadController from "../../src/controllers/UploadController";
import PaymentController from "../../src/controllers/PaymentController";
// Services
import AuthService from "../../src/services/AuthService";
import CandidateService from "../../src/services/CandidateService";
import UserService from "../../src/services/UserService";
import RecruiterService from "../../src/services/RecruiterService";
import JobPostService from "../../src/services/JobPostService";
import UploadService from "../../src/services/UploadService";
import GithubService from "../../src/services/GitHubService";
import PaymentService from "../../src/services/PaymentService";
// Routes
import AuthRoutes from "./AuthRoutes";
import CandidateRoutes from "./CandidateRoutes";
import RecruiterRoutes from "./RecruiterRoutes";
import JobPostRoutes from "./JobPostRoutes";
import UploadRouter from "./UploadRoutes";
import PaymentRoutes from "./PaymentRoutes";
import EmailController from "../controllers/EmailController";
import EmailRoutes from "./EmailRoutes";

class Routes {
    public router: Router;
    // Shared services and repositories
    private authService: AuthService;
    private candidateRepository: CandidateRepository;
    private userRepository: UserRepository;
    private recruiterRepository: RecruiterRepository;
    private jobPostRepository: JobPostRepository;
    private applicantRepository: ApplicantRepository;
    private uploadService: UploadService;
    private paymentService: PaymentService;
    private githubService: GithubService;
    constructor() {
        this.router = Router();
        // Initialize shared services and repositories
        this.authService = new AuthService();
        this.candidateRepository = new CandidateRepository();
        this.userRepository = new UserRepository();
        this.recruiterRepository = new RecruiterRepository();
        this.jobPostRepository = new JobPostRepository();
        this.applicantRepository = new ApplicantRepository();
        this.uploadService = new UploadService();
        this.paymentService = new PaymentService(config);
        this.githubService = new GithubService();
        this.initializeRoutes();
    }
    // Lazy load objects to avoid circular dependencies
    private initializeRoutes(): void {
        this.router.use('/auth', this.lazyLoadAuthRoutes());
        this.router.use('/candidate', this.lazyLoadCandidateRoutes());
        this.router.use('/recruiter', this.lazyLoadRecruiterRoutes());
        this.router.use('/job-post', this.lazyLoadJobPostRoutes());
        this.router.use('/email', this.lazyLoadEmailRoutes());
        this.router.use('/upload', this.lazyLoadUploadRoutes());
        this.router.use('/payment', this.lazyLoadPaymentRoutes());
    }
    private lazyLoadAuthRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const authController = new AuthController(this.authService);
            const authRoutes = new AuthRoutes(authController);
            authRoutes.getRouter()(req, res, next);
        };
    }
    private lazyLoadCandidateRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const candidateService = new CandidateService(this.candidateRepository);
            const userService = new UserService(this.userRepository);
            const candidateController = new CandidateController(candidateService, userService);
            const githubController = new GithubController(this.githubService);
            const candidateRoutes = new CandidateRoutes(candidateController, githubController);
            candidateRoutes.getRouter()(req, res, next);
        };
    }
    private lazyLoadRecruiterRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const recruiterService = new RecruiterService(this.recruiterRepository);
            const recruiterController = new RecruiterController(recruiterService, this.authService);
            const recruiterRoutes = new RecruiterRoutes(recruiterController);
            recruiterRoutes.getRouter()(req, res, next);
        };
    }
    private lazyLoadJobPostRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const jobPostService = new JobPostService(this.jobPostRepository, this.candidateRepository, this.recruiterRepository, this.applicantRepository);
            const jobPostController = new JobPostController(jobPostService);
            const jobPostRoutes = new JobPostRoutes(jobPostController);
            jobPostRoutes.getRouter()(req, res, next);
        };
    }
    private lazyLoadUploadRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const uploadController = new UploadController(this.uploadService);
            const uploadRouter = new UploadRouter(uploadController);
            uploadRouter.getRouter()(req, res, next);
        };
    }
    private lazyLoadPaymentRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const paymentController = new PaymentController(this.paymentService);
            const paymentRouter = new PaymentRoutes(paymentController);
            paymentRouter.getRouter()(req, res, next);
        }
    }

    private lazyLoadEmailRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const emailController = new EmailController();
            const emailRoutes = new EmailRoutes(emailController);
            emailRoutes.getRouter()(req, res, next);
        }
    }
}

export default new Routes().router;
