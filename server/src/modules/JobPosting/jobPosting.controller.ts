import { Job_Post } from "@prisma/client";
import JobPostingService from "./jobPosting.service";
import { Request, Response } from "express";
import { log } from "console";

const JobController = {
    getJobPostings: async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, pageSize } = req.body;
            const data: Job_Post[] | null = await JobPostingService.getJobPostingsByPage(page, pageSize);
            if (!data) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPostingsByRecruiter: async (req: Request, res: Response): Promise<void> => {
        try {
            const { recruiterId, postId } = req.body;
            const data: Job_Post[] | null = await JobPostingService.getJobPostingsByRecruiter(recruiterId, postId);
            if (!data) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPostingSaved : async (req: Request, res: Response): Promise<void> => {
        try {
            const { candidateId, postId } = req.body;
            const data: Job_Post[] | null = await JobPostingService.getJobsSaved(candidateId, postId);
            if (!data) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobsApplied : async (req: Request, res: Response): Promise<void> => {
        try {
            const { candidateId, postId } = req.body;
            const data: Job_Post[] | null = await JobPostingService.getJobsApplied(candidateId, postId);
            if (!data) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const jobId = req.params.id;
            const data: Job_Post | null = await JobPostingService.getJobPostingById(jobId);
            if (!data) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    findByJobPosition: async (req: Request, res: Response): Promise<void> => {
        try {
            const { keySearch } = req.query;
            const data: Job_Post[] | null = await JobPostingService.findJobPostingsByJobPosition((keySearch as string));
            if (!data) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, data });

        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    filterByLocation: async (req: Request, res: Response): Promise<void> => {
        try {
            const { locationSelection } = req.query;
            const data: Job_Post[] | null = await JobPostingService.filterJobPostingByLocation((locationSelection as string));
            if (!data) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, data });

        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    filterByIndustry: async (req: Request, res: Response): Promise<void> => {
        try {
            const { industrySelection } = req.query;
            const data: Job_Post[] | null = await JobPostingService.filterJobPostingByIndustry((industrySelection as string));
            if (!data) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, data });

        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    createJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                recruiter_id, job_title, job_image, type_of_work, location, job_salary, candidates_limit, education_required, years_of_experience, type_of_industry,
                professional_skills, certificate_required, languages_required, job_benefit, leave_policy, job_description, work_enviroment, job_schedule, application_deadline
            } = req.body;
            const isCreated: boolean | null = await JobPostingService.createJobPosting(recruiter_id, job_title, job_image, type_of_work, location, job_salary, candidates_limit, education_required, years_of_experience, type_of_industry,
                professional_skills, certificate_required, languages_required, job_benefit, leave_policy, job_description, work_enviroment, job_schedule, application_deadline);
            if (!isCreated) {
                res.status(500).json({ success: false, message: "Job not created!" });
                return;
            }
            res.status(200).json({ success: true, message: 'Created successfull!' });
        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    deleteJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const jobId = req.params.jobId;
            const isDeleted = await JobPostingService.deleteJobPosting(jobId);
            if (!isDeleted) {
                res.status(500).json({ success: false, message: "Job not deleted!" });
                return;
            }
            res.status(200).json({ success: true, message: 'Deleted successfull!' });
        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    }
}

export default JobController;