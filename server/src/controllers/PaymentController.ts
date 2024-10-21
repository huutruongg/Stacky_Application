
import PaymentService from "../services/PaymentService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export default class PaymentController extends BaseController {
    private paymentService: PaymentService;

    constructor(paymentService: PaymentService) {
        super();
        this.paymentService = paymentService;
    }

    public async createTransaction(req: Request, res: Response) {
        try {
            const data = await this.paymentService.createTransaction();
            if (!data) {
                return this.sendError(res, 500, 'Failed to create transaction');
            }
            return this.sendResponse(res, 200, data);
        } catch (error: any) {
            return this.sendError(res, 500, error.message);
        }
    }

    public async handleCallback(req: Request, res: Response) {
        try {
            const isValid = this.paymentService.verifyCallback(req.body);
            if (!isValid) {
                return this.sendError(res, 400, 'Invalid callback data');
            }

            console.log("Update order status as success based on app_trans_id");
            return this.sendResponse(res, 200, { message: 'Successful!' });
        } catch (error: any) {
            return this.sendError(res, 500, error.message);
        }
    }

    public async checkTransactionStatus(req: Request, res: Response) {
        const { app_trans_id } = req.body;

        try {
            const data = await this.paymentService.checkTransactionStatus(app_trans_id);
            if (!data) {
                return this.sendError(res, 500, 'Failed to check transaction status');
            }
            return this.sendResponse(res, 200, data);
        } catch (error: any) {
            return this.sendError(res, 500, error.message);
        }
    }
}