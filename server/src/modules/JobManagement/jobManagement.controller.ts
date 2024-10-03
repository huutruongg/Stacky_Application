import { IJobPost } from './../../types/IJobPost.d';

import JobManagementService from "./jobManagement.service";
import { Request, Response } from "express";
import { log } from "console";
import { DuplicateApplicationError } from "../../utils/errors/DuplicateApplicationError";

const JobManagementController = {
    getJobPostings: async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, pageSize } = req.query;
            const result: IJobPost[] | null = await JobManagementService.getJobPostingsByPage(Number(page), Number(pageSize));
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
            const result: IJobPost[] | null = await JobManagementService.getJobPostingsByRecruiter(recruiterId, postId);
            if (!result) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPostingsSaved: async (req: Request, res: Response): Promise<void> => {
        try {
            const { candidateId } = req.body;
            const result: IJobPost[] | null = await JobManagementService.getJobsSaved(candidateId);
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
            const { candidateId } = req.body;
            const result: IJobPost[] | null = await JobManagementService.getJobsApplied(candidateId);
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
            const jobPostId = req.params.jobPostId;
            const result: IJobPost | null = await JobManagementService.getJobPostingById(jobPostId);
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
            const result: IJobPost[] | null = await JobManagementService.findJobPostingsByJobPosition((keySearch as string));
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
            const result: IJobPost[] | null = await JobManagementService.filterJobPostingByLocation(String(locationSelection));
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
            const result: IJobPost[] | null = await JobManagementService.filterJobPostingByIndustry((industrySelection as string));
            if (!result) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
                return;
            }
            res.status(200).json({ success: true, result });

        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    getJobsPosted: async (req: Request, res: Response): Promise<void> => {
        try {
            const recruiterId = req.params.recruiterId;
            const result: IJobPost[] | null = await JobManagementService.getJobsPosted(recruiterId);
            if (!result) {
                res.status(500).json({ success: false, message: "Jobs not found!" });
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

            const isCreated: boolean | null = await JobManagementService.createJobPosting(
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
            const isDeleted = await JobManagementService.deleteJobPosting(jobId);
            if (!isDeleted) {
                res.status(500).json({ success: false, message: "Job not deleted!" });
                return;
            }
            res.status(200).json({ success: true, message: 'Deleted successfull!' });
        } catch (error) {
            log(error)
            res.status(500).json({ success: false, error: 'Internal Server Error!' });
        }
    },

    createApplication: async (req: Request, res: Response): Promise<void> => {
        try {
            const jobPostId = req.params.jobPostId;
            const { candidateId } = req.body;

            const result = await JobManagementService.createApplication(candidateId, jobPostId);

            if (!result) {
                res.status(500).json({ success: false, message: "Failed to create application." });
                return;
            }

            res.status(201).json({ success: true, message: "Application created successfully." });
        } catch (error: any) {
            if (error instanceof DuplicateApplicationError) {
                // Handle the custom error for duplicate application
                res.status(400).json({ success: false, message: error.message });
            } else {
                // Handle general errors
                res.status(500).json({ success: false, message: "Internal Server Error." });
            }
        }
    },

    savedJobPost: async (req: Request, res: Response): Promise<void> => {
        try {
            const jobPostId = req.params.jobPostId;
            const { candidateId } = req.body;
            const isSaved = await JobManagementService.savedJobPost(candidateId, jobPostId);
            if (!isSaved) {
                res.status(400).json({
                    success: false,
                    message: 'Job post has already been saved by this candidate.'
                });
                return;
            }
            res.status(201).json({
                success: true,
                message: 'Job post saved successfully!'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error.'
            });
        }
    },

    cancelJobPostSaved: async (req: Request, res: Response): Promise<void> => {
        try {
            const jobSavedId = req.params.jobSavedId;

            const isDeleted = await JobManagementService.cancelJobPostSaved(jobSavedId);

            if (!isDeleted) {
                res.status(404).json({
                    success: false,
                    message: 'Job post was not found or already removed from saved list.'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Job post removed from saved list successfully.'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error.'
            });
        }
    }
}

export default JobManagementController;