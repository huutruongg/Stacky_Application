import { log } from "console";
import { IApplicant, IJobPost } from "../../types/IJobPost";
import PostStatus from "../../types/EnumPostStatus";
import { DuplicateApplicationError } from "../../utils/errors/DuplicateApplication.error";
import { IJobPostMin } from "../../types/IJobPostMin";
import { JobPost } from "../../models/jobPost.model";
import { Candidate } from "../../models/candidate.model";
import ApplyStatus from "../../types/EnumApplicationStatus";
import { ICandidate, IJobApplied } from "../../types/ICandidate";
import { Recruiter } from "../../models/recruiter.model";
import { User } from "../../models/user.model";
import { Types } from "mongoose";

// Helper function to find by ID
const handleFindById = async (
  Model: any,
  id: string,
  modelName: string
): Promise<any | null> => {
  try {
    const data = await Model.findById(id).exec();
    if (!data) {
      console.warn(`${modelName} with ID ${id} not found.`);
    }
    return data;
  } catch (error) {
    log(`Error fetching ${modelName} by ID:`, error);
    return null;
  }
};

// Helper function to find by recruiterId and postId
const handleFindByRecruiterAndPostId = async (
  recruiterId: string,
  postId: string
): Promise<IJobPost[] | null> => {
  try {
    const jobPosts = await JobPost.find({ _id: postId, recruiterId }).exec();
    return jobPosts.length > 0 ? jobPosts : null;
  } catch (error) {
    log(error);
    return null;
  }
};

// Helper function to find by candidateId
const handleFindByCandidate = async (
  Model: any,
  candidateId: string,
  field: string
): Promise<IJobPost[] | null> => {
  try {
    const items = await Model.find({ candidateId }).populate(field).exec();
    return items.length > 0 ? items.map((item: any) => item[field]) : null;
  } catch (error) {
    log(error);
    return null;
  }
};

// Helper function to find by field with regex
const handleFindByField = async (
  Model: any,
  fieldName: string,
  value: string
): Promise<IJobPostMin[] | null> => {
  try {
    // First query: Find the matching job posts with selected fields
    const data: IJobPost[] = await Model.find({
      [fieldName]: { $regex: value, $options: "i" },
    })
      .select("jobTitle jobImage jobSalary location recruiterId") // Select only required fields
      .exec();

    if (!data || data.length === 0) {
      return null;
    }

    // Extract recruiterIds
    const recruiterIds = data.map((post) => post.userId);

    // Second query: Find the recruiters by recruiterIds to get the orgName
    const recruiters = await Recruiter.find({ _id: { $in: recruiterIds } })
      .select("orgName") // Select only the orgName
      .exec();

    // Create a recruiterMap to map recruiterId to orgName
    const recruiterMap = recruiters.reduce((map, recruiter) => {
      map[String(recruiter._id)] = recruiter.orgName;
      return map;
    }, {} as Record<string, string>);

    // Merge job post data with the recruiter orgName
    const result = data.map((post) => ({
      _id: post._id,
      userId: post.userId,
      jobTitle: post.jobTitle,
      jobImage: post.jobImage,
      jobSalary: post.jobSalary,
      location: post.location,
      orgName: recruiterMap[String(post.userId)] || "Unknown",
    }));

    return result;
  } catch (error) {
    console.error(`Error fetching by ${fieldName}:`, error);
    return null;
  }
};

// Helper function to delete by ID
const handleDeleteById = async (
  Model: any,
  id: string,
  modelName: string
): Promise<boolean> => {
  try {
    const result = await Model.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error) {
    log(`Error deleting ${modelName} with ID ${id}:`, error);
    return false;
  }
};

const JobManagementService = {
  getJobPostingById: async (id: string): Promise<IJobPost | null> => {
    return handleFindById(JobPost, id, "JobPost");
  },

  getJobPostingsByRecruiter: async (
    recruiterId: string,
    postId: string
  ): Promise<IJobPost[] | null> => {
    return handleFindByRecruiterAndPostId(recruiterId, postId);
  },

  async getSavedJobPosts(userId: string) {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }

      // Bước 1: Tìm candidate theo userId và lấy mảng jobSaved
      const candidate = await Candidate.findOne({
        userId: new Types.ObjectId(userId),
      })
        .select("jobSaved") // Chỉ lấy trường jobSaved để tối ưu
        .lean();

      if (!candidate || candidate.jobSaved.length === 0) {
        return []; // Không tìm thấy công việc đã lưu
      }

      // Lấy danh sách jobPostId từ mảng jobSaved
      const savedJobIds = candidate.jobSaved.map((job) => job.jobPostId);

      // Bước 2: Truy vấn JobPost với danh sách jobPostId
      const savedJobPosts = await JobPost.find({ _id: { $in: savedJobIds } })
        .select("jobTitle jobImage location jobSalary orgName postedAt") // Chọn trường cần thiết
        .lean();

      return savedJobPosts;
    } catch (error) {
      console.error("Error fetching saved job posts:", error);
      throw new Error("Failed to retrieve saved job posts");
    }
  },

  getJobsApplied: async (userId: string): Promise<IJobPost[] | null> => {
    try {
      // Step 1: Find the candidate's applied jobs
      const candidate = await Candidate.findOne({
        userId: new Types.ObjectId(userId),
      })
        .select("jobApplied") // Chỉ lấy trường jobSaved để tối ưu
        .lean();

      if (!candidate || candidate.jobApplied.length === 0) {
        return []; // Không tìm thấy công việc đã lưu
      }

      // Extract the jobPost IDs from the candidate's applied jobs
      const jobPostIds = candidate.jobApplied.map(
        (application) => application.jobPostId
      );

      // Step 2: Query the JobPost collection using the extracted jobPost IDs
      const jobsApplied = await JobPost.find({ _id: { $in: jobPostIds } })
        .select(
          "jobTitle jobImage jobSalary location typeOfWork postStatus postedAt"
        ) // Select only necessary fields
        .lean()
        .exec();

      return jobsApplied;
    } catch (error) {
      log(error);
      return null;
    }
  },

  findJobPostingsByJobPosition: async (
    key: string
  ): Promise<IJobPostMin[] | null> => {
    return handleFindByField(JobPost, "jobTitle", key);
  },

  filterJobPostingByLocation: async (
    location: string
  ): Promise<IJobPostMin[] | null> => {
    // log("HHHHHHHHHHHH: ", handleFindByField(JobPost, "location", location))
    return await handleFindByField(JobPost, "location", location);
  },

  filterJobPostingByIndustry: async (
    industry: string
  ): Promise<IJobPostMin[] | null> => {
    return handleFindByField(JobPost, "typeOfIndustry", industry);
  },

  getJobsPosted: async (recruiterId: string): Promise<IJobPost[] | null> => {
    try {
      const jobPosts = await JobPost.find({ recruiterId }).exec();
      return jobPosts.length > 0 ? jobPosts : null;
    } catch (error) {
      log(error);
      return null;
    }
  },

  getJobPostingsByPage: async (
    page: number,
    pageSize: number
  ): Promise<IJobPostMin[] | null> => {
    if (page <= 0 || pageSize <= 0) {
      console.warn("Invalid pagination parameters");
      return null;
    }

    try {
      // Perform both queries concurrently
      const [jobPosts, recruiters] = await Promise.all([
        JobPost.find()
          .select("_id jobTitle jobImage jobSalary location recruiterId")
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean()
          .exec(),

        Recruiter.find().select("_id orgName").lean().exec(),
      ]);

      if (!jobPosts || jobPosts.length === 0) {
        console.warn("No job posts found");
        return null;
      }

      // Create a recruiter map for quick lookup
      const recruiterMap = new Map<string, string>();
      recruiters.forEach((recruiter) => {
        recruiterMap.set(String(recruiter._id), recruiter.orgName);
      });

      // Merge job posts with recruiter organization names
      const mergedResults: IJobPostMin[] = jobPosts.map((post) => ({
        jobTitle: post.jobTitle,
        jobImage: post.jobImage,
        jobSalary: post.jobSalary,
        location: post.location,
        orgName: recruiterMap.get(String(post.userId)) || "Unknown", // Handle missing orgName
      }));

      return mergedResults;
    } catch (error) {
      console.error("Error fetching job postings by page:", error);
      return null;
    }
  },

  getJobPostings: async (): Promise<IJobPostMin[] | null> => {
    try {
      // Perform both queries concurrently
      const [jobPosts, recruiters] = await Promise.all([
        JobPost.find()
          .select("_id jobTitle jobImage jobSalary location recruiterId")
          .lean()
          .exec(),

        Recruiter.find().select("_id orgName").lean().exec(),
      ]);

      if (!jobPosts || jobPosts.length === 0) {
        console.warn("No job posts found");
        return null;
      }

      // Create a recruiter map for quick lookup
      const recruiterMap = new Map<string, string>();
      recruiters.forEach((recruiter) => {
        recruiterMap.set(String(recruiter._id), recruiter.orgName);
      });

      // Merge job posts with recruiter organization names
      const mergedResults: IJobPostMin[] = jobPosts.map((post) => ({
        jobId: post._id,
        jobTitle: post.jobTitle,
        jobImage: post.jobImage,
        jobSalary: post.jobSalary,
        location: post.location,
        orgName: recruiterMap.get(String(post.userId)) || "Unknown", // Handle missing orgName
      }));

      return mergedResults;
    } catch (error) {
      console.error("Error fetching job postings by page:", error);
      return null;
    }
  },

  getJobPostsByCandidate: async (userId: string): Promise<IJobPostMin[] | null> => {
    try {
      // Fetch job posts, recruiters, and candidate data in parallel
      const [jobPosts, recruiters, candidate] = await Promise.all([
        JobPost.find()
          .select("_id jobTitle jobImage jobSalary location userId")
          .lean()
          .exec(),

        Recruiter.find().select("_id orgName userId").lean().exec(),

        // Fetch candidate by userId
        Candidate.findOne({ userId }).select("jobSaved").lean().exec(),
      ]);

      console.log("Job posts: ", jobPosts);
      console.log("Recruiters: ", recruiters);
      console.log("Candidate: ", candidate);

      if (!jobPosts || jobPosts.length === 0) {
        console.warn("No job posts found");
        return null;
      }

      // Extract job IDs saved by the candidate
      const savedJobIds = candidate?.jobSaved.map((job) => job.jobPostId.toString()) || [];

      // Map through job posts and attach orgName and isLiked flag
      const jobsWithDetails = jobPosts.map((job) => {
        // Handle cases where job.userId or recruiter.userId might be undefined
        const recruiter = recruiters.find(
          (rec) => rec.userId?.toString() === job.userId?.toString()
        );

        return {
          ...job,
          orgName: recruiter ? recruiter.orgName : "Unknown",
          isLiked: savedJobIds.includes(job._id.toString()),
        };
      });

      return jobsWithDetails;
    } catch (error) {
      console.error("Error fetching job postings:", error);
      return null;
    }
  },


  createJobPosting: async (jobPostingDataReq: IJobPost): Promise<boolean> => {
    try {
      const data = await JobPost.create({
        ...jobPostingDataReq,
        postStatus: PostStatus.PENDING,
        postedAt: new Date(),
      });
      log("Job posting created successfully", data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  deleteJobPosting: async (jobId: string): Promise<boolean> => {
    return handleDeleteById(JobPost, jobId, "JobPost");
  },

  createApplication: async (
    userId: string,
    jobPostId: string
  ): Promise<boolean> => {
    try {
      // Step 1: Check if the candidate has already applied to the job
      const candidateApplied = await Candidate.findOne({
        userId: userId,
        "jobApplied.jobPostId": jobPostId,
      }).lean();

      if (candidateApplied) {
        console.warn(
          `Candidate ${userId} has already applied for job ${jobPostId}`
        );
        return false;
      }

      // Step 2: Retrieve the candidate's full information
      const user = await User.findById(userId).lean();

      log("User: ", user);
      if (!user) {
        console.warn(`User with ID ${userId} not found.`);
        return false;
      }

      const candidate: ICandidate | null = await Candidate.findOne({
        userId,
      }).exec();
      if (!candidate) {
        console.warn(`Candidate with ID ${userId} not found.`);
        return false;
      }
      // Step 3: Create the application object with copied candidate information
      const newApplicant: IApplicant = {
        userId: candidate.userId,
        programmingSkills: candidate.programmingSkills,
        linkedinUrl: candidate.linkedinUrl,
        githubUrl: candidate.githubUrl,
        personalDescription: candidate.personalDescription,
        languages: candidate.languages,
        projects: candidate.projects,
        educations: candidate.educations,
        experiences: candidate.experiences,
        certifications: candidate.certifications,
        status: ApplyStatus.PENDING,
        githubScore: 0,
        appliedAt: new Date(),
      };

      // Step 4: Add the application to the candidate's jobApplied array
      await Candidate.updateOne(
        { userId: userId },
        {
          $push: {
            jobApplied: {
              jobPostId,
              status: ApplyStatus.PENDING,
              appliedAt: new Date(),
            },
          },
        }
      );

      // Step 5: Add the new applicant to the job post's applicants array
      const jobPostUpdate = await JobPost.updateOne(
        { _id: jobPostId },
        { $push: { applicants: newApplicant } }
      );

      if (jobPostUpdate.modifiedCount === 0) {
        console.warn(
          `Failed to update job post ${jobPostId} with new applicant.`
        );
        return false;
      }

      console.log(
        `Candidate ${userId} successfully applied for job ${jobPostId}.`
      );
      return true;
    } catch (error) {
      log(error);
      return false;
    }
  },

  savedJobPost: async (
    userId: string,
    jobSavedId: string
  ): Promise<boolean> => {
    try {
      // Check if the job post exists
      const jobPostExists = await JobPost.exists({ _id: jobSavedId });
      if (!jobPostExists) {
        console.warn(`Job post with ID ${jobSavedId} does not exist.`);
        return false;
      }

      // Update candidate's saved jobs without duplicating entries
      const result = await Candidate.updateOne(
        {
          userId: userId,
          "jobSaved.jobPostId": { $ne: jobSavedId }, // Ensure it's not already saved
        },
        {
          $push: { jobSaved: { jobPostId: jobSavedId } },
        }
      );

      // Check if a document was modified
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error saving job post:", error);
      return false;
    }
  },

  cancelJobPostSaved: async (jobSavedId: string): Promise<boolean> => {
    try {
      const result = await Candidate.updateOne(
        { "jobSaved._id": jobSavedId },
        { $pull: { jobSaved: { _id: jobSavedId } } }
      );

      if (result.modifiedCount === 0) {
        console.warn(`No jobSaved entry found with ID: ${jobSavedId}`);
        return false;
      }

      console.log(`Successfully removed jobSaved entry with ID: ${jobSavedId}`);
      return true;
    } catch (error) {
      console.error("Error removing jobSaved entry:", error);
      return false;
    }
  },

  setApplyStatus: async (
    jobPostId: string,
    status: string
  ): Promise<boolean> => {
    try {
      await JobPost.findByIdAndUpdate(jobPostId, { postStatus: status });
      return true;
    } catch (error) {
      log(error);
      return false;
    }
  },

  censorJobPost: async (
    jobPostId: string,
    status: string
  ): Promise<boolean> => {
    try {
      await JobPost.findByIdAndUpdate(jobPostId, { postStatus: status });
      return true;
    } catch (error) {
      log(error);
      return false;
    }
  },
};

export default JobManagementService;
