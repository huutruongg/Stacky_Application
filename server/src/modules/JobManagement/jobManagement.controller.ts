import { Request, Response } from "express";
import JobManagementService from "./jobManagement.service";
import { log } from "console";
import JobManagementValidate from "../../utils/validations/jobManagement.validation";
import { DuplicateApplicationError } from "../../utils/errors/DuplicateApplication.error";

const JobManagementController = {
  getJobPostings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, pageSize } = req.query;
      let result = null;
      if (!page || !pageSize) {
        result = await JobManagementService.getJobPostings();
      } else {
        result = await JobManagementService.getJobPostingsByPage(
          Number(page),
          Number(pageSize)
        );
      }
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  getJobDetail: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, jobPostId } = req.params;
      const result = await JobManagementService.getJobPostingById(jobPostId);
      const isSaved = await JobManagementService.isSavedJobPost(userId, jobPostId);
      if (!result) {
        res.status(404).json({ success: false, message: "Job not found!" });
        return;
      }

      res.status(200).json({
        success: true,
        isLiked: isSaved,
        result
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
    }
  },

  getCandidateJobs: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const result = await JobManagementService.getJobPostsByCandidate(userId);
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  getJobPostingsByRecruiter: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { error } =
        JobManagementValidate.recruiterIdPostIdSchema().validate(req.body);
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { recruiterId, postId } = req.body;
      const result = await JobManagementService.getJobPostingsByRecruiter(
        recruiterId,
        postId
      );
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  getJobPostingsSaved: async (req: Request, res: Response): Promise<void> => {
    try {
      //   const { error } = JobManagementValidate.candidateIdSchema().validate(
      //     req.body
      //   );
      //   if (error) {
      //     res
      //       .status(400)
      //       .json({ success: false, message: error.details[0].message });
      //     return;
      //   }

      const userId = req.params.userId;
      const result = await JobManagementService.getSavedJobPosts(userId);
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  getJobsApplied: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.candidateIdSchema().validate(
        req.body
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { userId } = req.body;
      const result = await JobManagementService.getJobsApplied(userId);
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  getJobPosting: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.jobPostIdSchema().validate(
        req.params
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { jobPostId } = req.params;

      // Thay vì gọi hàm xử lý trong hàng đợi, hãy gọi trực tiếp nếu cần.
      const result = await JobManagementService.getJobPostingById(jobPostId);
      if (!result) {
        res.status(404).json({ success: false, message: "Job not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
    }
  },

  findByJobPosition: async (req: Request, res: Response): Promise<void> => {
    try {
      // const { error } = JobManagementValidate.findByJobPositionSchema().validate(req.query);
      // if (error) {
      //     res.status(400).json({ success: false, message: error.details[0].message });
      //     return;
      // }

      const { keySearch } = req.query;
      const result = await JobManagementService.findJobPostingsByJobPosition(
        keySearch as string
      );
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  filterByLocation: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.filterByLocationSchema().validate(
        req.query
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { locationSelection } = req.query;
      // log("LOGGGGGGGGGG: ", locationSelection)
      const result = await JobManagementService.filterJobPostingByLocation(
        locationSelection as string
      );
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  filterByIndustry: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.filterByIndustrySchema().validate(
        req.query
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { industrySelection } = req.query;
      const result = await JobManagementService.filterJobPostingByIndustry(
        industrySelection as string
      );
      if (!result || result.length === 0) {
        res.status(404).json({ success: false, message: "Jobs not found!" });
        return;
      }

      res.status(200).json({ success: true, result });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  createJobPosting: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.createJobPostingSchema().validate(
        req.body
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      // Extract userId from the request body or authenticated session
      const { userId, ...jobPostingData } = req.body;

      if (!userId) {
        res
          .status(400)
          .json({ success: false, message: "User ID is required" });
        return;
      }

      const isCreated = await JobManagementService.createJobPosting({
        userId,
        ...jobPostingData,
      });

      if (!isCreated) {
        res.status(404).json({ success: false, message: "Job not created!" });
        return;
      }

      res.status(200).json({ success: true, message: "Created successfully!" });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  deleteJobPosting: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.jobPostIdSchema().validate(
        req.params
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { jobPostId } = req.params;
      const isDeleted = await JobManagementService.deleteJobPosting(jobPostId);
      if (!isDeleted) {
        res.status(404).json({ success: false, message: "Job not deleted!" });
        return;
      }

      res.status(200).json({ success: true, message: "Deleted successfully!" });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  createApplication: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.jobPostIdSchema().validate(
        req.params
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { userId } = req.body;
      const { jobPostId } = req.params;
      const result = await JobManagementService.createApplication(
        userId,
        jobPostId
      );

      if (!result) {
        res
          .status(404)
          .json({ success: false, message: "Failed to create application." });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Application created successfully." });
    } catch (error: any) {
      if (error instanceof DuplicateApplicationError) {
        res.status(400).json({ success: false, message: error.message });
        return;
      } else {
        // log(error);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ success: false, message: "Internal Server Error!" });
          return;
        }
      }
    }
  },

  savedJobPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.jobPostIdSchema().validate(
        req.body
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { userId, jobPostId } = req.body;
      const isSaved = await JobManagementService.savedJobPost(
        userId,
        jobPostId
      );

      if (!isSaved) {
        res.status(404).json({
          success: false,
          message: "Job post has already been saved by this candidate.",
        });
        return;
      }

      res
        .status(200)
        .json({
          success: true,
          isLiked: true,
          message: "Job post saved successfully!"
        });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  cancelJobPostSaved: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = JobManagementValidate.jobSavedIdSchema().validate(
        req.params
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }

      const { jobSavedId } = req.params;
      const isDeleted = await JobManagementService.cancelJobPostSaved(
        jobSavedId
      );

      if (!isDeleted) {
        res.status(404).json({
          success: false,
          isLiked: false,
          message: "Job post was not found or already removed from saved list.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Job post removed from saved list successfully.",
      });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  setApplyStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobPostId, status } = req.body;
      const { error } = JobManagementValidate.ApplyStatusSchema().validate(
        req.body
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }
      const isSet = await JobManagementService.setApplyStatus(
        jobPostId,
        status
      );
      if (!isSet) {
        res.status(404).json({ success: false, message: "Set status failed." });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "Set status successfully." });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },

  censorJobPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobPostId, status } = req.body;
      const { error } = JobManagementValidate.JobPostStatusSchema().validate(
        req.body
      );
      if (error) {
        res
          .status(400)
          .json({ success: false, message: error.details[0].message });
        return;
      }
      const isSet = await JobManagementService.censorJobPost(jobPostId, status);
      if (!isSet) {
        res.status(404).json({ success: false, message: "Set status failed." });
        return;
      }
      res
        .status(200)
        .json({ success: true, message: "Set status successfully." });
    } catch (error) {
      // log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!" });
      return;
    }
  },
};

export default JobManagementController;
