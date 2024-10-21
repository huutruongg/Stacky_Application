
import PaymentController from '../../src/controllers/PaymentController';
import { UserRole } from '../../src/enums/EUserRole';
import { authenticateJWT } from '../../src/middlewares/AuthenticateMiddleware';
import { authorizeJWT } from '../../src/middlewares/AuthorizeMiddleware';
import { BaseRoutes } from './BaseRoutes';

export default class PaymentRoutes extends BaseRoutes {
    private paymentController: PaymentController;

    constructor(paymentController: PaymentController) {
        super();
        this.paymentController = paymentController;
        this.autoBindControllerMethods(this.paymentController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/create-transaction', authenticateJWT, authorizeJWT(UserRole.RECRUITER), this.paymentController.createTransaction);
        this.router.post('/callback', this.paymentController.handleCallback);
        this.router.post('/check-status-transaction', authenticateJWT, authorizeJWT(UserRole.RECRUITER), this.paymentController.checkTransactionStatus);
    }
}