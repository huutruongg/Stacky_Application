
import PaymentController from '../../src/controllers/PaymentController';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import refreshToken from '../middlewares/refreshToken';
import verifyToken from '../middlewares/verifyToken';
import { UserRoles } from '../utils/roles';
import { BaseRoutes } from './BaseRoutes';
import { Request, Response } from 'express';
import path from 'path';

export default class PaymentRoutes extends BaseRoutes {
    private paymentController: PaymentController;

    constructor(paymentController: PaymentController) {
        super();
        this.paymentController = paymentController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Public routes
        this.router.get('/deposit', this.serveDepositPage);
        this.router.get('/pay-for', this.servePaymentPage);
        this.router.post('/create-transaction', this.paymentController.createTransaction);
        this.router.post('/callback', this.paymentController.handleCallback);
        this.router.post('/check-status-transaction', this.paymentController.checkTransactionStatus);
        // Admin or recruiter routes for creating notifications
        this.router.patch('/deposit-funds', verifyToken, refreshToken, authenticate, authorize(['deposit']),
            this.paymentController.deposit);
        this.router.patch('/pay-for-job-post', verifyToken, refreshToken, authenticate, authorize(['payForJobPost']),
            this.paymentController.payForJobPost);
        this.router.get('/get-payment-info', verifyToken, refreshToken, authenticate, authorize(['getPaymentInfo']),
            this.paymentController.getPaymentInfo);
    }

    private serveDepositPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/deposit.html'));
    }

    private servePaymentPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/payment.html'));
    }
}