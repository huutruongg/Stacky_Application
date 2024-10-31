import { authorizeJWT } from '../../src/middlewares/AuthorizeMiddleware';
import { authenticateJWT } from '../../src/middlewares/AuthenticateMiddleware';
import { Router } from "express";
import RecruiterController from "../../src/controllers/RecruiterController";
import { BaseRoutes } from "./BaseRoutes";
import { UserRole } from '../../src/enums/EUserRole';

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
        this.router.post('/change-password/:userId', authenticateJWT, authorizeJWT(UserRole.RECRUITER), this.recruiterController.resetPassword);
        this.router.get('/get-candidates-applied/:jobPostId', this.recruiterController.getApplicants);
        // this.router.post('/update-company-account', RecruiterController.updateComapanyAccount);
        this.router.put('/update-company-info', authenticateJWT, this.recruiterController.updateComapanyInfo);
        this.router.get('/get-company-info/:userId', this.recruiterController.getCompanyInfo);
    }
}