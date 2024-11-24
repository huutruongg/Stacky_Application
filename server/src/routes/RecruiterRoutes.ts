
import { authenticateJWT } from '../middlewares/Authenticate';
import { Router } from "express";
import RecruiterController from "../../src/controllers/RecruiterController";
import { BaseRoutes } from "./BaseRoutes";
import { UserRoles } from '../utils/roles';
import { cacheMiddleware } from '../middlewares/CacheRedis';
import { authorize } from '../middlewares/Authorize';

export default class RecruiterRoutes extends BaseRoutes {
    private recruiterController: RecruiterController;
    constructor(recruiterController: RecruiterController) {
        super();
        this.recruiterController = recruiterController;
        this.autoBindControllerMethods(this.recruiterController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/forgot-password', this.recruiterController.forgotPassword);
        this.router.post('/reset-password/:userId', this.recruiterController.resetPassword);
        this.router.post('/change-password/:userId', authenticateJWT, authorize(['recruiter:write']), this.recruiterController.resetPassword);
        this.router.get('/get-candidates-applied/:jobPostId', this.recruiterController.getApplicants);
        this.router.get('/get-potential-candidate/:jobPostId/:candidateId', this.recruiterController.getPotentialCandidate);
        this.router.put('/update-company-account', authenticateJWT, this.recruiterController.updateComapanyAccount);
        this.router.put('/update-company-info', authenticateJWT, this.recruiterController.updateComapanyInfo);
        this.router.get('/get-company-info/:userId', this.recruiterController.getCompanyInfo);
        this.router.get('/get-list-company', cacheMiddleware, this.recruiterController.getListCompany);
    }
}