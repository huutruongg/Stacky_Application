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

    public getAllJobs = async (req: Request, res: Response): Promise<void> => {
        try {
            const jobs = await this.adminService.getAllJobs();
            this.sendResponse(res, 200, { success: true, jobs });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public getAllCandidates = async (req: Request, res: Response): Promise<void> => {
        try {
            const candidates = await this.adminService.getAllCandidates();
            this.sendResponse(res, 200, { success: true, candidates });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public getAllCompanies = async (req: Request, res: Response): Promise<void> => {
        try {
            const companies = await this.adminService.getAllRecruiters();
            this.sendResponse(res, 200, { success: true, companies });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public getDetailCompany = async (req: Request, res: Response): Promise<void> => {
        try {
            const recruiterId = req.params.recruiterId;
            const company = await this.adminService.getDetailCompany(recruiterId);
            this.sendResponse(res, 200, { success: true, company });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public countJobsByMonth = async (req: Request, res: Response): Promise<void> => {
        try {
            const year = req.query.year as string;
            const result = await this.adminService.countJobsByMonth(year);
            this.sendResponse(res, 200, { success: true, result });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public getTotalCards = async (req: Request, res: Response): Promise<void> => {
        try {
            const totalCards = await this.adminService.getTotalCards();
            this.sendResponse(res, 200, { success: true, totalCards });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public getTop5PostedJobs = async (req: Request, res: Response): Promise<void> => {
        try {
            const top5PostedJobs = await this.adminService.getTop5PostedJobs();
            this.sendResponse(res, 200, { success: true, result: top5PostedJobs });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public getRevenueReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const year = req.query.year as string;
            const revenueReport = await this.adminService.getRevenueReport(year);
            this.sendResponse(res, 200, { success: true, result: revenueReport });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public deleteJob = async (req: Request, res: Response): Promise<void> => {
        try {
            const jobId = req.params.jobId;
            await this.adminService.deleteJob(jobId);
            this.sendResponse(res, 200, { success: true });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public deleteCandidate = async (req: Request, res: Response): Promise<void> => {
        try {
            const candidateId = req.params.candidateId;
            await this.adminService.deleteCandidate(candidateId);
            this.sendResponse(res, 200, { success: true });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public deleteCompany = async (req: Request, res: Response): Promise<void> => {
        try {
            const recruiterId = req.params.recruiterId;
            await this.adminService.deleteCompany(recruiterId);
            this.sendResponse(res, 200, { success: true });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public searchJobs = async (req: Request, res: Response): Promise<void> => {
        try {
            const query = req.query.q as string;
            const jobs = await this.adminService.searchJobs(query);
            this.sendResponse(res, 200, { success: true, jobs });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public searchCandidates = async (req: Request, res: Response): Promise<void> => {
        try {
            const query = req.query.q as string;
            const candidates = await this.adminService.searchCandidates(query);
            this.sendResponse(res, 200, { success: true, candidates });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };

    public searchCompanies = async (req: Request, res: Response): Promise<void> => {
        try {
            const query = req.query.q as string;
            const companies = await this.adminService.searchCompanies(query);
            this.sendResponse(res, 200, { success: true, companies });
        } catch (error) {
            log(error);
            this.sendError(res, 500, 'Internal server error');
        }
    };
}