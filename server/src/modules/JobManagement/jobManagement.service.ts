import { log } from "console";
import { IJobPost } from "../../types/IJobPost";
import { JobPost } from "../../models/jobPost.model";
import { JobSaved } from "../../models/jobSaved.model";
import { Application } from "../../models/application.model";
import PostStatus from "../../types/EnumPostStatus";
import { DuplicateApplicationError } from "../../utils/errors/DuplicateApplicationError";



// Helper function to find by ID
const handleFindById = async (Model: any, id: string, modelName: string): Promise<any | null> => {
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
const handleFindByRecruiterAndPostId = async (recruiterId: string, postId: string): Promise<IJobPost[] | null> => {
    try {
        const jobPosts = await JobPost.find({ _id: postId, recruiterId }).exec();
        return jobPosts.length > 0 ? jobPosts : null;
    } catch (error) {
        log(error);
        return null;
    }
};

// Helper function to find by candidateId
const handleFindByCandidate = async (Model: any, candidateId: string, field: string): Promise<IJobPost[] | null> => {
    try {
        const items = await Model.find({ candidateId }).populate(field).exec();
        return items.length > 0 ? items.map((item: any) => item[field]) : null;
    } catch (error) {
        log(error);
        return null;
    }
};

// Helper function to find by field with regex
const handleFindByField = async (Model: any, fieldName: string, value: string): Promise<IJobPost[] | null> => {
    try {
        const data = await Model.find({ [fieldName]: { $regex: value, $options: 'i' } }).exec();
        return data.length > 0 ? data : null;
    } catch (error) {
        log(`Error fetching by ${fieldName}:`, error);
        return null;
    }
};

// Helper function to delete by ID
const handleDeleteById = async (Model: any, id: string, modelName: string): Promise<boolean> => {
    try {
        const result = await Model.findByIdAndDelete(id).exec();
        return !!result;
    } catch (error) {
        log(`Error deleting ${modelName} with ID ${id}:`, error);
        return false;
    }
};

// Helper function to save job post for candidate
const handleSaveJobPost = async (candidateId: string, jobSavedId: string): Promise<boolean> => {
    try {
        const existingJob = await JobSaved.findOne({ candidateId, jobSavedId });
        if (existingJob) {
            return false;
        }
        const newSavedJob = new JobSaved({ candidateId, jobSavedId });
        await newSavedJob.save();
        return true;
    } catch (error: any) {
        log(error);
        return false;
    }
};

const JobManagementService = {
    getJobPostingById: async (id: string): Promise<IJobPost | null> => {
        return handleFindById(JobPost, id, "JobPost");
    },

    getJobPostingsByRecruiter: async (recruiterId: string, postId: string): Promise<IJobPost[] | null> => {
        return handleFindByRecruiterAndPostId(recruiterId, postId);
    },

    getJobsSaved: async (candidateId: string): Promise<IJobPost[] | null> => {
        return handleFindByCandidate(JobSaved, candidateId, "jobPost");
    },

    getJobsApplied: async (candidateId: string): Promise<IJobPost[] | null> => {
        return handleFindByCandidate(Application, candidateId, "jobPost");
    },

    findJobPostingsByJobPosition: async (key: string): Promise<IJobPost[] | null> => {
        return handleFindByField(JobPost, "jobTitle", key);
    },

    filterJobPostingByLocation: async (location: string): Promise<IJobPost[] | null> => {
        return handleFindByField(JobPost, "location", location);
    },

    filterJobPostingByIndustry: async (industry: string): Promise<IJobPost[] | null> => {
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

    getJobPostingsByPage: async (page: number, pageSize: number): Promise<IJobPost[] | null> => {
        try {
            return await JobPost.find()
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .exec();
        } catch (error) {
            log(error);
            return null;
        }
    },

    createJobPosting: async (jobPostingDataReq: IJobPost): Promise<boolean> => {
        try {
            await JobPost.create({
                ...jobPostingDataReq,
                postStatus: PostStatus.PENDING,
                postedAt: new Date(),
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    deleteJobPosting: async (jobId: string): Promise<boolean> => {
        return handleDeleteById(JobPost, jobId, "JobPost");
    },

    createApplication: async (candidateId: string, jobPostId: string): Promise<boolean> => {
        try {
            const existingApplication = await Application.findOne({ candidateId, jobPostId });

            if (existingApplication) {
                throw new DuplicateApplicationError('Candidate has already applied for this job.');
            }

            const application = new Application({ candidateId, jobPostId });
            await application.save();
            return true;
        } catch (error: any) {
            log(error);
            return false;
        }
    },

    savedJobPost: async (candidateId: string, jobSavedId: string): Promise<boolean> => {
        return handleSaveJobPost(candidateId, jobSavedId);
    },

    cancelJobPostSaved: async (jobSavedId: string): Promise<boolean> => {
        return handleDeleteById(JobSaved, jobSavedId, "JobSaved");
    }
};

export default JobManagementService;
