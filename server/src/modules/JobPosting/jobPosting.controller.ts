
import JobPostingService from "./jobPosting.service";
import { Request, Response } from "express";
import { log } from "console";
import { IJobPost } from "../../types/IJobPost";

const JobController = {
    getJobPostings: async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, pageSize } = req.query;
            const result: IJobPost[] | null = await JobPostingService.getJobPostingsByPage(Number(page), Number(pageSize));
            if (!result) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPostingsByRecruiter: async (req: Request, res: Response): Promise<void> => {
        try {
            const { recruiterId, postId } = req.body;
            const result: IJobPost[] | null = await JobPostingService.getJobPostingsByRecruiter(recruiterId, postId);
            if (!result) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPostingSaved: async (req: Request, res: Response): Promise<void> => {
        try {
            const { candidateId, postId } = req.body;
            const result: IJobPost[] | null = await JobPostingService.getJobsSaved(candidateId, postId);
            if (!result) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobsApplied: async (req: Request, res: Response): Promise<void> => {
        try {
            const { candidateId, postId } = req.body;
            const result: IJobPost[] | null = await JobPostingService.getJobsApplied(candidateId, postId);
            if (!result) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const jobId = req.params.id;
            const result: IJobPost | null = await JobPostingService.getJobPostingById(jobId);
            if (!result) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    findByJobPosition: async (req: Request, res: Response): Promise<void> => {
        try {
            const { keySearch } = req.query;
            const result: IJobPost[] | null = await JobPostingService.findJobPostingsByJobPosition((keySearch as string));
            if (!result) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, result });

        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    filterByLocation: async (req: Request, res: Response): Promise<void> => {
        try {
            const { locationSelection } = req.query;
            log(locationSelection)
            const result: IJobPost[] | null = await JobPostingService.filterJobPostingByLocation(String(locationSelection));
            if (!result) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, result });

        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    filterByIndustry: async (req: Request, res: Response): Promise<void> => {
        try {
            const { industrySelection } = req.query;
            const result: IJobPost[] | null = await JobPostingService.filterJobPostingByIndustry((industrySelection as string));
            if (!result) {
                res.status(500).json({ success: false, message: "Job not found!" });
                return;
            }
            res.status(200).json({ success: true, result });

        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    createJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                recruiterId, jobTitle, jobImage, typeOfWork, location, jobSalary, candidatesLimit, educationRequired, yearsOfExperience, typeOfIndustry, professionalSkills,
                certificateRequired, languagesRequired, jobBenefit, leavePolicy, jobDescription, workEnvironment, jobSchedule, applicationDeadline
            } = req.body;

            const isCreated: boolean | null = await JobPostingService.createJobPosting(
                recruiterId, jobTitle, jobImage, typeOfWork, location, jobSalary, candidatesLimit, educationRequired, yearsOfExperience, typeOfIndustry, professionalSkills,
                certificateRequired, languagesRequired, jobBenefit, leavePolicy, jobDescription, workEnvironment, jobSchedule, applicationDeadline
            );
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