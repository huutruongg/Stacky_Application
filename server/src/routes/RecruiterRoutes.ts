
import RecruiterController from "../../src/controllers/RecruiterController";
import { BaseRoutes } from "./BaseRoutes";
import { redisCache } from '../middlewares/redisCache';
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";
import verifyToken from "../middlewares/verifyToken";
import refreshToken from "../middlewares/refreshToken";

export default class RecruiterRoutes extends BaseRoutes {
    private recruiterController: RecruiterController;
    constructor(recruiterController: RecruiterController) {
        super();
        this.recruiterController = recruiterController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/forgot-password', this.recruiterController.forgotPassword);
        this.router.post('/reset-password/:userId', this.recruiterController.resetPassword);
        this.router.post('/change-password/:userId', verifyToken, refreshToken, authenticate, authorize(['resetPassword']),
            this.recruiterController.resetPassword);
        this.router.get('/get-candidates-applied/:jobPostId', verifyToken, refreshToken, authenticate, authorize(['getApplicants']),
            this.recruiterController.getApplicants);
        this.router.patch('/update-candidates-status', verifyToken, refreshToken, authenticate, authorize(['updateCandidatesStatus']),
            this.recruiterController.updateCandidatesStatus);
        this.router.get('/get-potential-candidate/:jobPostId/:candidateId', this.recruiterController.getPotentialCandidate);
        this.router.put('/update-company-account', verifyToken, refreshToken, authenticate, authorize(['updateComapanyAccount']),
            this.recruiterController.updateCompanyAccount);
        this.router.put('/update-company-info', verifyToken, refreshToken, authenticate, authorize(['updateComapanyInfo']),
            this.recruiterController.updateCompanyInfo);
        this.router.get('/get-company-info/:userId', this.recruiterController.getCompanyInfo);
        this.router.get('/get-list-company', redisCache, this.recruiterController.getListCompany);

    }
}