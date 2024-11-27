import AdminController from "../controllers/AdminController";
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
        this.router.get('/get-all-jobs', this.adminController.getAllJobs);
        this.router.get('/get-all-candidates', this.adminController.getAllCandidates);
        this.router.get('/get-all-companies', this.adminController.getAllCompanies);
        this.router.get('/get-detail-company/:recruiterId', this.adminController.getDetailCompany);
        this.router.get('/count-jobs-by-month', this.adminController.countJobsByMonth);
        this.router.get('/get-total-cards', this.adminController.getTotalCards);
    }
}