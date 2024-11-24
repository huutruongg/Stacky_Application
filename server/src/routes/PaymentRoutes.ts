
import PaymentController from '../../src/controllers/PaymentController';
import { UserRoles } from '../utils/roles';
import { authenticateJWT } from '../middlewares/Authenticate';
import { BaseRoutes } from './BaseRoutes';
import { Request, Response } from 'express';
import path from 'path';

export default class PaymentRoutes extends BaseRoutes {
    private paymentController: PaymentController;

    constructor(paymentController: PaymentController) {
        super();
        this.paymentController = paymentController;
        this.autoBindControllerMethods(this.paymentController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/deposit', this.serveDepositPage);
        this.router.get('/pay-for', this.servePaymentPage);
        this.router.post('/create-transaction', this.paymentController.createTransaction);
        this.router.post('/callback', this.paymentController.handleCallback);
        this.router.post('/check-status-transaction', this.paymentController.checkTransactionStatus);
        this.router.patch('/deposit-funds', authenticateJWT, this.paymentController.deposit);
        this.router.patch('/pay-for-job-post', authenticateJWT, this.paymentController.payForJobPost);
        this.router.get('/get-payment-info', authenticateJWT, this.paymentController.getPaymentInfo);
    }

    private serveDepositPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/deposit.html'));
    }

    private servePaymentPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/payment.html'));
    }
}