import AdminController from "../controllers/AdminController";
import { authenticateJWT } from "../middlewares/Authenticate";
import { BaseRoutes } from "./BaseRoutes";

export default class AdminRoutes extends BaseRoutes {
    private adminController: AdminController;
    constructor(adminController: AdminController) {
        super();
        this.adminController = adminController;
        this.autoBindControllerMethods(this.adminController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // getting
        this.router.get('/get-all-jobs', authenticateJWT, this.adminController.getAllJobs);
        this.router.get('/get-all-candidates', authenticateJWT, this.adminController.getAllCandidates);
        this.router.get('/get-detail-candidate/:candidateId', authenticateJWT, this.adminController.getDetailCandidate);
        this.router.get('/get-all-companies', authenticateJWT, this.adminController.getAllCompanies);
        this.router.get('/get-detail-company/:recruiterId', authenticateJWT, this.adminController.getDetailCompany);
        this.router.get('/count-jobs-by-month', authenticateJWT, this.adminController.countJobsByMonth);
        this.router.get('/get-total-cards', authenticateJWT, this.adminController.getTotalCards);
        this.router.get('/get-top-5-posted-jobs', authenticateJWT, this.adminController.getTop5PostedJobs);
        this.router.get('/get-revenue-report', authenticateJWT, this.adminController.getRevenueReport);
        // deleting
        this.router.delete('/delete-job/:jobId', authenticateJWT, this.adminController.deleteJob);
        this.router.delete('/delete-candidate/:candidateId', authenticateJWT, this.adminController.deleteCandidate);
        this.router.delete('/delete-recruiter/:recruiterId', authenticateJWT, this.adminController.deleteCompany);
        // searching
        this.router.get('/search-jobs', authenticateJWT, this.adminController.searchJobs);
        this.router.get('/search-candidates', authenticateJWT, this.adminController.searchCandidates);
        this.router.get('/search-companies', authenticateJWT, this.adminController.searchCompanies);
    }
}