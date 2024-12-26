import AdminController from "../controllers/AdminController";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";
import refreshToken from "../middlewares/refreshToken";
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

            refreshToken, authenticate, authorize(['getAllJobs']),
            this.adminController.getAllJobs);
        this.router.get('/get-all-candidates',
            refreshToken, authenticate, authorize(['getAllCandidates']),
            this.adminController.getAllCandidates);
        this.router.get('/get-all-companies',
            refreshToken, authenticate, authorize(['getAllCompanies']),
            this.adminController.getAllCompanies);
        this.router.get('/get-detail-company/:recruiterId',
            refreshToken, authenticate, authorize(['getDetailCompany']),
            this.adminController.getDetailCompany);
        this.router.get('/count-jobs-by-month',
            refreshToken, authenticate, authorize(['countJobsByMonth']),
            this.adminController.countJobsByMonth);
        this.router.get('/get-total-cards',
            refreshToken, authenticate, authorize(['getTotalCards']),
            this.adminController.getTotalCards);
        this.router.get('/get-top-5-posted-jobs',
            refreshToken, authenticate, authorize(['getTop5PostedJobs']),
            this.adminController.getTop5PostedJobs);
        this.router.get('/get-revenue-report',
            refreshToken, authenticate, authorize(['getRevenueReport']),
            this.adminController.getRevenueReport);
        // deleting
        this.router.delete('/delete-job/:jobId',
            refreshToken, authenticate, authorize(['deleteJob']),
            this.adminController.deleteJob);
        this.router.delete('/delete-candidate/:candidateId',
            refreshToken, authenticate, authorize(['deleteCandidate']),
            this.adminController.deleteCandidate);
        this.router.delete('/delete-recruiter/:recruiterId',
            refreshToken, authenticate, authorize(['deleteCompany']),
            this.adminController.deleteCompany);
        // searching
        this.router.get('/search-jobs',
            refreshToken, authenticate, authorize(['searchJobs']),
            this.adminController.searchJobs);
        this.router.get('/search-candidates',
            refreshToken, authenticate, authorize(['searchCandidates']),
            this.adminController.searchCandidates);
        this.router.get('/search-companies',
            refreshToken, authenticate, authorize(['searchCompanies']),
            this.adminController.searchCompanies);
        this.router.post('/sync-json-to-mongodb',
            refreshToken, authenticate, authorize(['syncJsonToMongoDB']),
            this.adminController.syncJsonToMongoDB);
    }
}