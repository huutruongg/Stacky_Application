import { log } from "console";
import { IJobPost } from "../../types/IJobPost";
import { JobPost } from "../../models/jobPost.model";
import { JobSaved } from "../../models/jobSaved.model";
import { Application } from "../../models/application.model";
import PostStatus from "../../types/EnumPostStatus";
import { DuplicateApplicationError } from "../../utils/errors/DuplicateApplication.error";
import { Recruiter } from "../../models/recruiter.model";
import { IJobPostMin } from "../../types/IJobPostMin";



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
const handleFindByField = async (Model: any, fieldName: string, value: string): Promise<IJobPostMin[] | null> => {
    try {
        // First query: Find the matching job posts with selected fields
        const data: IJobPost[] = await Model.find({ [fieldName]: { $regex: value, $options: 'i' } })
            .select('jobTitle jobImage jobSalary location recruiterId') // Select only required fields
            .exec();

        if (!data || data.length === 0) {
            return null;
        }

        // Extract recruiterIds
        const recruiterIds = data.map(post => post.recruiterId);

        // Second query: Find the recruiters by recruiterIds to get the orgName
        const recruiters = await Recruiter.find({ _id: { $in: recruiterIds } })
            .select('orgName') // Select only the orgName
            .exec();

        // Create a recruiterMap to map recruiterId to orgName
        const recruiterMap = recruiters.reduce((map, recruiter) => {
            map[String(recruiter._id)] = recruiter.orgName;
            return map;
        }, {} as Record<string, string>);

        // Merge job post data with the recruiter orgName
        const result = data.map(post => ({
            _id: post._id,
            recruiterId: post.recruiterId,
            jobTitle: post.jobTitle,
            jobImage: post.jobImage,
            jobSalary: post.jobSalary,
            location: post.location,
            orgName: recruiterMap[post.recruiterId.toString()] || 'Unknown'
        }));

        return result;
    } catch (error) {
        console.error(`Error fetching by ${fieldName}:`, error);
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

    findJobPostingsByJobPosition: async (key: string): Promise<IJobPostMin[] | null> => {
        return handleFindByField(JobPost, "jobTitle", key);
    },

    filterJobPostingByLocation: async (location: string): Promise<IJobPostMin[] | null> => {
        // log("HHHHHHHHHHHH: ", handleFindByField(JobPost, "location", location))
        return await handleFindByField(JobPost, "location", location);
    },

    filterJobPostingByIndustry: async (industry: string): Promise<IJobPostMin[] | null> => {
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

    getJobPostingsByPage: async (page: number, pageSize: number): Promise<IJobPostMin[] | null> => {
        if (page <= 0 || pageSize <= 0) {
            console.warn('Invalid pagination parameters');
            return null;
        }

        try {
            // Perform the two queries concurrently using Promise.all()
            const [jobPosts, recruiters] = await Promise.all([
                JobPost.find()
                    .select('_id jobTitle jobImage jobSalary location recruiterId')
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec(),

                Recruiter.find()
                    .select('_id orgName')
                    .exec()
            ]);

            if (!jobPosts || jobPosts.length === 0) {
                console.warn('No job posts found');
                return null;
            }

            // Create a recruiterMap with a Map object for better key management
            const recruiterMap = new Map<string, string>();
            recruiters.forEach(recruiter => {
                recruiterMap.set(String(recruiter._id), recruiter.orgName);
            });

            // Merge the jobPosts with the recruiter orgNames
            const mergedResults = jobPosts.map(post => ({
                _id: post._id,
                recruiterId: post.recruiterId,
                jobTitle: post.jobTitle,
                jobImage: post.jobImage,
                jobSalary: post.jobSalary,
                location: post.location,
                orgName: recruiterMap.get(post.recruiterId.toString()) || 'Unknown' // Handle missing orgName
            }));

            return mergedResults;
        } catch (error) {
            console.error('Error fetching job postings by page:', error);
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
    },

    setApplyStatus: async (applicationId: string, status: string): Promise<boolean> => {
        try {
            await Application.findByIdAndUpdate(applicationId, { status: status })
            return true;
        } catch (error) {
            log(error);
            return false;
        }
    },

    censorJobPost: async (jobPostId: string, status: string): Promise<boolean> => {
        try {
            await JobPost.findByIdAndUpdate(jobPostId, { postStatus: status })
            return true;
        } catch (error) {
            log(error);
            return false;
        }
    }
};

export default JobManagementService;
