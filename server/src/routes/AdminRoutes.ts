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
        this.router.get('/get-all-jobs', authenticateJWT, this.adminController.getAllJobs);
        this.router.get('/get-all-candidates', authenticateJWT, this.adminController.getAllCandidates);
        this.router.get('/get-all-companies', authenticateJWT, this.adminController.getAllCompanies);
        this.router.get('/get-detail-company/:recruiterId', authenticateJWT, this.adminController.getDetailCompany);
        this.router.get('/count-jobs-by-month', authenticateJWT, this.adminController.countJobsByMonth);
        this.router.get('/get-total-cards', authenticateJWT, this.adminController.getTotalCards);
    }
}