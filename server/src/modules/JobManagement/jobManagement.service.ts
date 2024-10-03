import { log } from "console";
import { IJobPost } from "../../types/IJobPost";
import { JobPost } from "../../models/jobPost.model";
import { JobSaved } from "../../models/jobSaved.model";
import { Application } from "../../models/application.model";
import PostStatus from "../../types/EnumPostStatus";
import { ILanguage } from "../../types/ICandidate";
import { DuplicateApplicationError } from "../../utils/errors/DuplicateApplicationError";


const JobManagementService = {
    getJobPostingById: async (id: string): Promise<IJobPost | null> => {
        try {
            const jobPost = await JobPost.findById(id).exec();
            if (!jobPost) {
                console.warn(`Job posting with ID ${id} not found.`);
            }
            return jobPost;
        } catch (error) {
            log(error);
            return null;
        }
    },


    getJobPostingsByRecruiter: async (recruiterId: string, postId: string): Promise<IJobPost[] | null> => {
        try {
            const jobPosts = await JobPost.find({
                _id: postId,
                recruiterId: recruiterId
            }).exec();

            if (!jobPosts || jobPosts.length === 0) {
                return null;
            }

            return jobPosts;
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobsSaved: async (candidateId: string): Promise<IJobPost[] | null> => {
        try {
            const savedJobs = await JobSaved.find({
                candidateId: candidateId
            }).populate('jobPost').exec();

            if (!savedJobs || savedJobs.length === 0) {
                return null;
            }

            return savedJobs.map(jobSaved => jobSaved.jobPost);
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobsApplied: async (candidateId: string): Promise<IJobPost[] | null> => {
        try {
            const appliedJobs = await Application.find({
                candidateId: candidateId
            }).populate('jobPost').exec();

            if (!appliedJobs || appliedJobs.length === 0) {
                return null;
            }

            return appliedJobs.map(jobApplied => jobApplied.jobPost);
        } catch (error) {
            log(error);
            return null;
        }
    },

    findJobPostingsByJobPosition: async (key: string): Promise<IJobPost[] | null> => {
        try {
            const data = await JobPost.find({
                jobTitle: { $regex: key, $options: 'i' }
            }).exec();
            return data;
        } catch (error) {
            log(error);
            return null;
        }
    },

    filterJobPostingByLocation: async (location: string): Promise<IJobPost[] | null> => {
        try {
            const data = await JobPost.find({
                location: { $regex: location, $options: 'i' }
            }).exec();

            log(data);
            return data;
        } catch (error) {
            log(error);
            return null;
        }
    },

    filterJobPostingByIndustry: async (industry: string): Promise<IJobPost[] | null> => {
        try {
            const data = await JobPost.find({
                typeOfIndustry: { $regex: industry, $options: 'i' } // Lọc theo ngành
            }).exec();
            return data;
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobsPosted: async (recruiterId: string): Promise<IJobPost[] | null> => {
        try {
            return await JobPost.find({
                recruiterId: recruiterId
            }).exec();
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

    createJobPosting: async (
        recruiterId: string,
        jobTitle: string,
        jobImage: string,
        typeOfWork: string,
        location: string,
        jobSalary: string,
        candidatesLimit: number,
        educationRequired: string,
        yearsOfExperience: string,
        typeOfIndustry: string,
        professionalSkills: string,
        certificateRequired: string,
        languagesRequired: ILanguage[],
        jobBenefit: string,
        leavePolicy: string,
        jobDescription: string,
        workEnvironment: string,
        jobSchedule: string,
        applicationDeadline: Date
    ): Promise<boolean | null> => {
        try {
            await JobPost.create({
                recruiterId,
                jobTitle,
                jobImage,
                typeOfWork,
                location,
                jobSalary,
                candidatesLimit,
                educationRequired,
                yearsOfExperience,
                typeOfIndustry,
                professionalSkills,
                certificateRequired,
                languagesRequired,
                jobBenefit,
                leavePolicy,
                jobDescription,
                workEnvironment,
                jobSchedule,
                applicationDeadline,
                postStatus: PostStatus.PENDING,
                postedAt: new Date(),
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    deleteJobPosting: async (jobId: string): Promise<boolean | null> => {
        try {
            await JobPost.findByIdAndDelete(jobId).exec();
            return true;
        } catch (error) {
            log(error);
            return false;
        }
    },

    createApplication: async (candidateId: string, jobPostId: string): Promise<boolean> => {
        try {
            const existingApplication = await Application.findOne({ candidateId, jobPostId });

            if (existingApplication) {
                throw new DuplicateApplicationError('Candidate has already applied for this job.');
            }

            const application = new Application({
                candidateId,
                jobPostId
            });
            await application.save();
            return true;
        } catch (error: any) {
            log(error);
            return false;
        }
    },

    savedJobPost: async (candidateId: string, jobSavedId: string): Promise<boolean> => {
        try {
            const existingJob = await JobSaved.findOne({ candidateId, jobSavedId });
            if (existingJob) {
                return false;
            }
            const newSavedJob = new JobSaved({
                candidateId,
                jobSavedId
            });
            await newSavedJob.save();
            return true;
        } catch (error: any) {
            log(error);
            return false;
        }
    },

    cancelJobPostSaved: async (jobSavedId: string): Promise<boolean> => {
        try {
            const result = await JobSaved.findByIdAndDelete(jobSavedId);
            if (result) {
                return true;
            }

            return false;
        } catch (error: any) {
            log(error);
            return false;
        }
    }
};

export default JobManagementService;
