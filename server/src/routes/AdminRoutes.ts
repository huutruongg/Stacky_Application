import AdminController from "../controllers/AdminController";
import { authenticateJWT } from "../middlewares/Authenticate";
import { authorize } from "../middlewares/Authorize";
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
        this.router.get('/get-all-jobs', authenticateJWT, authorize(['getAllJobs']), this.adminController.getAllJobs);
        this.router.get('/get-all-candidates', authenticateJWT, authorize(['getAllCandidates']), this.adminController.getAllCandidates);
        this.router.get('/get-all-companies', authenticateJWT, authorize(['getAllCompanies']), this.adminController.getAllCompanies);
        this.router.get('/get-detail-company/:recruiterId', authenticateJWT, authorize(['getDetailCompany']), this.adminController.getDetailCompany);
        this.router.get('/count-jobs-by-month', authenticateJWT, authorize(['countJobsByMonth']), this.adminController.countJobsByMonth);
        this.router.get('/get-total-cards', authenticateJWT, authorize(['getTotalCards']), this.adminController.getTotalCards);
        this.router.get('/get-top-5-posted-jobs', authenticateJWT, authorize(['getTop5PostedJobs']), this.adminController.getTop5PostedJobs);
        this.router.get('/get-revenue-report', authenticateJWT, authorize(['getRevenueReport']), this.adminController.getRevenueReport);
        // deleting
        this.router.delete('/delete-job/:jobId', authenticateJWT, authorize(['deleteJob']), this.adminController.deleteJob);
        this.router.delete('/delete-candidate/:candidateId', authenticateJWT, authorize(['deleteCandidate']), this.adminController.deleteCandidate);
        this.router.delete('/delete-recruiter/:recruiterId', authenticateJWT, authorize(['deleteCompany']), this.adminController.deleteCompany);
        // searching
        this.router.get('/search-jobs', authenticateJWT, authorize(['searchJobs']), this.adminController.searchJobs);
        this.router.get('/search-candidates', authenticateJWT, authorize(['searchCandidates']), this.adminController.searchCandidates);
        this.router.get('/search-companies', authenticateJWT, authorize(['searchCompanies']), this.adminController.searchCompanies);
    }
}