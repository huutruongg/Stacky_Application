import { log } from "console";
import AdminService from "../services/AdminService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export default class AdminController extends BaseController {
    private adminService: AdminService;
    constructor(adminService: AdminService) {
        super();
        this.adminService = adminService;
    }


    public async getAllJobs(req: Request, res: Response): Promise<void> {
        try {
            const jobs = await this.adminService.getAllJobs();
            return this.sendResponse(res, 200, { success: true, jobs });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async getAllCandidates(req: Request, res: Response): Promise<void> {
        try {
            const candidates = await this.adminService.getAllCandidates();
            return this.sendResponse(res, 200, { success: true, candidates });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async getAllCompanies(req: Request, res: Response): Promise<void> {
        try {
            const companies = await this.adminService.getAllRecruiters();
            return this.sendResponse(res, 200, { success: true, companies });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async getDetailCompany(req: Request, res: Response): Promise<void> {
        try {
            const recruiterId = req.params.recruiterId;
            const company = await this.adminService.getDetailCompany(recruiterId);
            return this.sendResponse(res, 200, { success: true, company });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async countJobsByMonth(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.adminService.countJobsByMonth();
            return this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async getTotalCards(req: Request, res: Response): Promise<void> {
        try {
            const totalCards = await this.adminService.getTotalCards();
            return this.sendResponse(res, 200, { success: true, totalCards });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }
}