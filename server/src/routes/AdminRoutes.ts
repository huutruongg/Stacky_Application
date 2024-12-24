import AdminController from "../controllers/AdminController";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";
import refreshToken from "../middlewares/refreshToken";
import verifyToken from "../middlewares/verifyToken";
import { BaseRoutes } from "./BaseRoutes";

export default class AdminRoutes extends BaseRoutes {
    private adminController: AdminController;
    constructor(adminController: AdminController) {
        super();
        this.adminController = adminController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // getting
        this.router.get('/get-all-jobs',
            verifyToken, refreshToken, authenticate, authorize(['getAllJobs']),
            this.adminController.getAllJobs);
        this.router.get('/get-all-candidates', verifyToken, refreshToken, authenticate, authorize(['getAllCandidates']),
            this.adminController.getAllCandidates);
        this.router.get('/get-all-companies', verifyToken, refreshToken, authenticate, authorize(['getAllCompanies']),
            this.adminController.getAllCompanies);
        this.router.get('/get-detail-company/:recruiterId', verifyToken, refreshToken, authenticate, authorize(['getDetailCompany']),
            this.adminController.getDetailCompany);
        this.router.get('/count-jobs-by-month', verifyToken, refreshToken, authenticate, authorize(['countJobsByMonth']),
            this.adminController.countJobsByMonth);
        this.router.get('/get-total-cards', verifyToken, refreshToken, authenticate, authorize(['getTotalCards']),
            this.adminController.getTotalCards);
        this.router.get('/get-top-5-posted-jobs', verifyToken, refreshToken, authenticate, authorize(['getTop5PostedJobs']),
            this.adminController.getTop5PostedJobs);
        this.router.get('/get-revenue-report', verifyToken, refreshToken, authenticate, authorize(['getRevenueReport']),
            this.adminController.getRevenueReport);
        // deleting
        this.router.delete('/delete-job/:jobId', verifyToken, refreshToken, authenticate, authorize(['deleteJob']),
            this.adminController.deleteJob);
        this.router.delete('/delete-candidate/:candidateId', verifyToken, refreshToken, authenticate, authorize(['deleteCandidate']),
            this.adminController.deleteCandidate);
        this.router.delete('/delete-recruiter/:recruiterId', verifyToken, refreshToken, authenticate, authorize(['deleteCompany']),
            this.adminController.deleteCompany);
        // searching
        this.router.get('/search-jobs', verifyToken, refreshToken, authenticate, authorize(['searchJobs']),
            this.adminController.searchJobs);
        this.router.get('/search-candidates', verifyToken, refreshToken, authenticate, authorize(['searchCandidates']),
            this.adminController.searchCandidates);
        this.router.get('/search-companies', verifyToken, refreshToken, authenticate, authorize(['searchCompanies']),
            this.adminController.searchCompanies);
    }
}