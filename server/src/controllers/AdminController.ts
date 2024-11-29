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

    public async getDetailCandidate(req: Request, res: Response): Promise<void> {
        try {
            const candidateId = req.params.candidateId;
            const candidate = await this.adminService.getDetailCandidate(candidateId);
            return this.sendResponse(res, 200, { success: true, candidate });
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

    public async getTop5PostedJobs(req: Request, res: Response): Promise<void> {
        try {
            const top5PostedJobs = await this.adminService.getTop5PostedJobs();
            return this.sendResponse(res, 200, { success: true, top5PostedJobs });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async getRevenueReport(req: Request, res: Response): Promise<void> {
        try {
            const year = req.query.year as string;
            const revenueReport = await this.adminService.getRevenueReport(year);
            return this.sendResponse(res, 200, { success: true, result: revenueReport });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async deleteJob(req: Request, res: Response): Promise<void> {
        try {
            const jobId = req.params.jobId;
            await this.adminService.deleteJob(jobId);
            return this.sendResponse(res, 200, { success: true });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async deleteCandidate(req: Request, res: Response): Promise<void> {
        try {
            const candidateId = req.params.candidateId;
            await this.adminService.deleteCandidate(candidateId);
            return this.sendResponse(res, 200, { success: true });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async deleteCompany(req: Request, res: Response): Promise<void> {
        try {
            const recruiterId = req.params.recruiterId;
            await this.adminService.deleteCompany(recruiterId);
            return this.sendResponse(res, 200, { success: true });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async searchJobs(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query.q as string;
            const jobs = await this.adminService.searchJobs(query);
            return this.sendResponse(res, 200, { success: true, jobs });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async searchCandidates(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query.q as string;
            const candidates = await this.adminService.searchCandidates(query);
            return this.sendResponse(res, 200, { success: true, candidates });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }

    public async searchCompanies(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query.q as string;
            const companies = await this.adminService.searchCompanies(query);
            return this.sendResponse(res, 200, { success: true, companies });
        } catch (error) {
            log(error);
            return this.sendError(res, 500, 'Internal server error');
        }
    }
}