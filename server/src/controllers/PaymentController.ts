
import { log } from "console";
import PaymentService from "../services/PaymentService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
import RecruiterService from "../services/RecruiterService";
import { IPayment } from "../interfaces/IPayment";
import { RevenueReport } from "../models/RevenueModel";

export default class PaymentController extends BaseController {
    private paymentService: PaymentService;
    private recruiterService: RecruiterService;

    constructor(paymentService: PaymentService, recruiterService: RecruiterService) {
        super();
        this.paymentService = paymentService;
        this.recruiterService = recruiterService;
    }

    public async createTransaction(req: Request, res: Response) {
        try {
            // const { urlRedirect, packageName, amount  } = req.body;
            const { packageName, amount } = req.body;
            const urlRedirect = `${process.env.URL_CLIENT}/payment`;
            log("packageName: ", packageName);
            log("amount: ", amount);
            const data = await this.paymentService.createTransaction(urlRedirect, packageName, amount);
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
        const { transId } = req.body;

        try {
            const data = await this.paymentService.checkTransactionStatus(transId);
            if (!data) {
                return this.sendError(res, 500, 'Failed to check transaction status');
            }
            return this.sendResponse(res, 200, data);
        } catch (error: any) {
            return this.sendError(res, 500, error.message);
        }
    }

    public async handleDepositReport(amount: number) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const isExisted = await RevenueReport.findOne({ month: currentMonth, year: currentYear });
        if (!isExisted) {
            const data = {
                year: String(currentYear),
                month: String(currentMonth),
                depositRevenue: amount
            }
            const newReport = new RevenueReport(data);
            newReport.save();
        } else {
            const data = await RevenueReport.findOne({ month: currentMonth, year: currentYear });
            if (!data) {
                return;
            }
            data.depositRevenue += amount;
            data.save();
        }
    }

    public async handlePaymentReport(amount: number) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const isExisted = await RevenueReport.findOne({ month: currentMonth, year: currentYear });
        if (!isExisted) {
            const data = {
                year: String(currentYear),
                month: String(currentMonth),
                paymentRevenue: amount
            }
            const newReport = new RevenueReport(data);
            newReport.save();
        } else {
            const data = await RevenueReport.findOne({ month: currentMonth, year: currentYear });
            if (!data) {
                return;
            }
            data.paymentRevenue += amount;
            data.save();
        }
    }

    public async deposit(req: Request, res: Response) {
        try {
            const { amount } = req.body;
            const userInfo = (req as any).userData;
            log("amount: ", amount);
            log("userId: ", userInfo.userId);
            const data = this.recruiterService.deposit(userInfo.userId, amount as number);
            log("updateBalance: ", data);
            const dataPayment = {
                payAmount: amount,
                transactionDate: new Date(),
                isDeposit: true
            }
            const dataPaymentUpdate = this.recruiterService.addPayment(userInfo.userId, dataPayment as IPayment);
            log("dataPaymentUpdate: ", dataPaymentUpdate);
            // update total deposit revenue
            this.handleDepositReport(amount);
            if (!data || !dataPaymentUpdate) {
                return this.sendError(res, 500, 'Failed to update balance');
            }
            return this.sendResponse(res, 200, { success: true, message: 'Balance updated successfully' });
        } catch (error: any) {
            return this.sendError(res, 500, error.message);
        }
    }

    public async payForJobPost(req: Request, res: Response) {
        const { balance, jobPostPrice } = req.body;
        const userInfo = (req as any).userData;
        try {
            if (balance < jobPostPrice) {
                return this.sendError(res, 400, 'Not enough balance to pay for job post');
            }

            const data = await this.recruiterService.payFor(userInfo.userId, (jobPostPrice * -1));
            if (!data) {
                return this.sendError(res, 500, 'Failed to update balance');
            }

            const dataPayment = {
                payAmount: jobPostPrice,
                transactionDate: new Date(),
                isDeposit: false
            }
            const dataPaymentUpdate = await this.recruiterService.addPayment(userInfo.userId, dataPayment as IPayment);
            log("dataPaymentUpdate: ", dataPaymentUpdate);
            // update total payment revenue
            this.handlePaymentReport(jobPostPrice);
            return this.sendResponse(res, 200, { success: true, message: 'Payment successful' });
        } catch (error: any) {
            return this.sendError(res, 500, error.message);
        }
    }

    public async getPaymentInfo(req: Request, res: Response) {
        try {
            const userInfo = (req as any).userData;
            const data = await this.recruiterService.getPaymentInfo(userInfo.userId);
            if (!data) {
                return this.sendError(res, 500, 'Failed to fetch payment info');
            }
            return this.sendResponse(res, 200, data);
        } catch (error: any) {
            return this.sendError(res, 500, error.message);
        }
    }
}