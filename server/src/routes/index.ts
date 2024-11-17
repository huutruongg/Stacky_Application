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
import ApplicantService from "../services/ApplicantService";
import NotificationController from "../controllers/NotificationController";
import NotificationRoutes from "./NotificationRoutes";
import NotificationRepository from "../repositories/NotificationRepository";
import NotificationService from "../services/NotificationService";
import AIController from "../controllers/AIController";
import AIRouter from "./AIRouter";
import GithubRoutes from "./GithubRoutes";

class Routes {
    public router: Router;
    // Shared services and repositories
    private authService: AuthService;
    private candidateRepository: CandidateRepository;
    private userRepository: UserRepository;
    private recruiterRepository: RecruiterRepository;
    private jobPostRepository: JobPostRepository;
    private applicantRepository: ApplicantRepository;
    private notificationRepository: NotificationRepository;
    private uploadService: UploadService;
    private paymentService: PaymentService;
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
        this.notificationRepository = new NotificationRepository();
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
        this.router.use('/notification', this.lazyLoadNotificationRoutes());
        this.router.use('/github', this.lazyLoadGithubRoutes());
        this.router.use('/ai', this.lazyLoadAIRoutes());
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
            const githubController = new GithubController();
            const candidateRoutes = new CandidateRoutes(candidateController, githubController);
            candidateRoutes.getRouter()(req, res, next);
        };
    }
    private lazyLoadRecruiterRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const recruiterService = new RecruiterService(this.recruiterRepository);
            const applicantService = new ApplicantService(this.applicantRepository);
            const userService = new UserService(this.userRepository);
            const recruiterController = new RecruiterController(recruiterService, this.authService, applicantService, userService);
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
            const recruiterService = new RecruiterService(this.recruiterRepository);
            const paymentController = new PaymentController(this.paymentService, recruiterService);
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

    private lazyLoadNotificationRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const notificationService = new NotificationService(this.notificationRepository);
            const notificationController = new NotificationController(notificationService);
            const notificationRoutes = new NotificationRoutes(notificationController);
            notificationRoutes.getRouter()(req, res, next);
        }
    }

    private lazyLoadAIRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const aiController = new AIController();
            const aiRouter = new AIRouter(aiController);
            aiRouter.getRouter()(req, res, next);
        }
    }

    private lazyLoadGithubRoutes() {
        return (req: Request, res: Response, next: NextFunction) => {
            const githubController = new GithubController();
            const githubRoutes = new GithubRoutes(githubController);
            githubRoutes.getRouter()(req, res, next);
        }
    }
}

export default new Routes().router;
