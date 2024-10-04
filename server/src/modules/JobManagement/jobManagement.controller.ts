import { Request, Response } from 'express';
import JobManagementService from "./jobManagement.service";
import { log } from 'console';
import JobManagementValidate from '../../utils/validations/jobManagement.validation';
import { DuplicateApplicationError } from '../../utils/errors/DuplicateApplicationError';

const JobManagementController = {
    getJobPostings: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.pageSchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { page, pageSize } = req.query;
            const result = await JobManagementService.getJobPostingsByPage(Number(page), Number(pageSize));
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPostingsByRecruiter: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.recruiterIdPostIdSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { recruiterId, postId } = req.body;
            const result = await JobManagementService.getJobPostingsByRecruiter(recruiterId, postId);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPostingsSaved: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.candidateIdSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { candidateId } = req.body;
            const result = await JobManagementService.getJobsSaved(candidateId);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobsApplied: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.candidateIdSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { candidateId } = req.body;
            const result = await JobManagementService.getJobsApplied(candidateId);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    getJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { jobPostId } = req.params;
            const result = await JobManagementService.getJobPostingById(jobPostId);
            if (!result) {
                res.status(404).json({ success: false, message: "Job not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    findByJobPosition: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.findByJobPositionSchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { keySearch } = req.query;
            const result = await JobManagementService.findJobPostingsByJobPosition(keySearch as string);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    filterByLocation: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.filterByLocationSchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { locationSelection } = req.query;
            const result = await JobManagementService.filterJobPostingByLocation(locationSelection as string);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    filterByIndustry: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.filterByIndustrySchema().validate(req.query);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { industrySelection } = req.query;
            const result = await JobManagementService.filterJobPostingByIndustry(industrySelection as string);
            if (!result || result.length === 0) {
                res.status(404).json({ success: false, message: "Jobs not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    createJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.createJobPostingSchema().validate(req.body);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const jobPostingData = req.body;
            const isCreated = await JobManagementService.createJobPosting(jobPostingData);
            if (!isCreated) {
                res.status(500).json({ success: false, message: "Job not created!" });
                return;
            }

            res.status(201).json({ success: true, message: 'Created successfully!' });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    deleteJobPosting: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const {jobPostId} = req.params;
            const isDeleted = await JobManagementService.deleteJobPosting(jobPostId);
            if (!isDeleted) {
                res.status(404).json({ success: false, message: "Job not deleted!" });
                return;
            }

            res.status(200).json({ success: true, message: 'Deleted successfully!' });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    createApplication: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { candidateId } = req.body;
            const { jobPostId } = req.params;
            const result = await JobManagementService.createApplication(candidateId, jobPostId);

            if (!result) {
                res.status(500).json({ success: false, message: "Failed to create application." });
                return;
            }

            res.status(201).json({ success: true, message: "Application created successfully." });
        } catch (error: any) {
            if (error instanceof DuplicateApplicationError) {
                res.status(400).json({ success: false, message: error.message });
                return;
            } else {
                log(error);
                res.status(500).json({ success: false, message: "Internal Server Error!" });
                return;
            }
        }
    },

    savedJobPost: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.jobPostIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { candidateId } = req.body;
            const { jobPostId } = req.params;
            const isSaved = await JobManagementService.savedJobPost(candidateId, jobPostId);

            if (!isSaved) {
                res.status(400).json({ success: false, message: 'Job post has already been saved by this candidate.' });
                return;
            }

            res.status(201).json({ success: true, message: 'Job post saved successfully!' });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    },

    cancelJobPostSaved: async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = JobManagementValidate.jobSavedIdSchema().validate(req.params);
            if (error) {
                res.status(400).json({ success: false, message: error.details[0].message });
                return;
            }

            const { jobSavedId } = req.params;
            const isDeleted = await JobManagementService.cancelJobPostSaved(jobSavedId);

            if (!isDeleted) {
                res.status(404).json({ success: false, message: 'Job post was not found or already removed from saved list.' });
                return;
            }

            res.status(200).json({ success: true, message: 'Job post removed from saved list successfully.' });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal Server Error!" });
        }
    }
};

export default JobManagementController;
