import { log } from "console";
import { IJobPost } from "../../types/IJobPost";
import { JobPost } from "../../models/jobPost.model";
import { JobSaved } from "../../models/jobSaved.model";
import { Application } from "../../models/application.model";
import PostStatus from "../../types/EnumPostStatus";
import { ILanguage } from "../../types/ICandidate";


const JobPostingService = {


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

    getJobsSaved: async (candidateId: string, postId: string): Promise<IJobPost[] | null> => {
        try {
            const savedJobs = await JobSaved.find({
                candidateId: candidateId,
                jobId: postId
            }).populate('jobPost').exec(); // Lấy jobPost liên kết qua populate

            if (!savedJobs || savedJobs.length === 0) {
                return null;
            }

            // Trả về danh sách JobPost từ các jobSaved đã lưu
            return savedJobs.map(jobSaved => jobSaved.jobPost); // Ép kiểu sang IJobPost nếu cần
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobsApplied: async (candidateId: string, postId: string): Promise<IJobPost[] | null> => {
        try {
            const appliedJobs = await Application.find({
                candidateId: candidateId,
                jobId: postId
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
                location: { $regex: location, $options: 'i' } // Lọc theo location
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

    getJobsPosted: async (userId: string): Promise<IJobPost[] | null> => {
        try {
            return await JobPost.find({
                recruiterId: userId
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

};

export default JobPostingService;
