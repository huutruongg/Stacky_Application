import { JobPost, PrismaClient } from "@prisma/client";
import { log } from "console";
import { v4 as uuidv4 } from "uuid"
const prisma = new PrismaClient();

const JobPostingService = {


    getJobPostingById: async (id: string): Promise<JobPost | null> => {
        try {
            const jobPost = await prisma.jobPost.findUnique({
                where: { jobId: id },
            });

            if (!jobPost) {
                console.warn(`Job posting with ID ${id} not found.`);
            }

            return jobPost;
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobPostingsByRecruiter: async (recruiterId: string, postId: string): Promise<JobPost[] | null> => {
        try {
            const jobPosts: JobPost[] | null = await prisma.jobPost.findMany({
                where: {
                    jobId: postId,
                    recruiterId: recruiterId
                },
            });

            if (!jobPosts) {
                return null;
            }

            return jobPosts;
        } catch (error) {
            log(error)
            return null;
        }
    },

    getJobsSaved: async (candidateId: string, postId: string): Promise<JobPost[] | null> => {
        try {
            const jobPosts = await prisma.jobSaved.findMany({
                where: {
                    candidateId: candidateId,
                    jobId: postId,
                },
                include: {
                    jobPost: true,
                },
            });

            if (!jobPosts) {
                return null;
            }
            return jobPosts.map(jobSaved => jobSaved.jobPost);
        } catch (error) {
            log(error)
            return null;
        }
    },

    getJobsApplied: async (candidateId: string, postId: string): Promise<JobPost[] | null> => {
        try {
            const jobPosts = await prisma.application.findMany({
                where: {
                    candidateId: candidateId,
                    jobId: postId,
                },
                include: {
                    jobPost: true,
                },
            });

            if (!jobPosts) {
                return null;
            }
            return jobPosts.map(jobApplied => jobApplied.jobPost);
        } catch (error) {
            log(error)
            return null;
        }
    },

    findJobPostingsByJobPosition: async (key: string): Promise<JobPost[] | null> => {
        try {
            const data: JobPost[] | null = await prisma.jobPost.findMany({
                where: {
                    jobTitle: {
                        contains: key,
                        mode: 'insensitive',
                    },
                },
            });
            return data;
        } catch (error) {
            log(error);
            return null;
        }
    },

    filterJobPostingByLocation: async (location: string): Promise<JobPost[] | null> => {
        try {
            const data: JobPost[] | null = await prisma.jobPost.findMany({
                where: {
                    recruiter: {
                        orgAddress: location
                    }
                },
                include: {
                    recruiter: {
                        select: {
                            orgAddress: true,
                        }
                    }
                }
            });
            return data;
        } catch (error) {
            log(error);
            return null;
        }
    },

    filterJobPostingByIndustry: async (industry: string): Promise<JobPost[] | null> => {
        try {
            const data: JobPost[] | null = await prisma.jobPost.findMany({
                where: {
                    typeOfIndustry: industry
                },
            });
            return data;
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobsPosted: async (userId: string): Promise<JobPost[] | null> => {
        try {
            return await prisma.jobPost.findMany({
                where: {
                    recruiterId: userId
                }
            });
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobPostingsByPage: async (page: number, pageSize: number): Promise<JobPost[] | null> => {
        try {
            return await prisma.jobPost.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize
            });
        } catch (error) {
            log(error);
            return null;
        }
    },

    createJobPosting: async (recruiterId: string, jobTitle: string, jobImage: string, typeOfWork: string, location: string, jobSalary: string, candidatesLimit: number, educationRequired: string,
        yearsOfExperience: string, typeOfIndustry: string, professionalSkills: string, certificateRequired: string, languagesRequired: string, jobBenefit: string, leavePolicy: string,
        jobDescription: string, workEnvironment: string, jobSchedule: string, applicationDeadline: string): Promise<boolean | null> => {
        try {
            await prisma.jobPost.create({
                data: {
                    recruiterId, jobTitle, jobImage, typeOfWork, location, jobSalary, candidatesLimit, educationRequired, yearsOfExperience, typeOfIndustry, professionalSkills,
                    certificateRequired, languagesRequired, jobBenefit, leavePolicy, jobDescription, workEnvironment, jobSchedule, applicationDeadline,
                },
            });
            return true;
        } catch (error) {
            log(error);
            return false;
        }
    },


    deleteJobPosting: async (jobId: string): Promise<boolean | null> => {
        try {
            await prisma.jobPost.delete({
                where: {
                    jobId: jobId
                }
            });
            return true;
        } catch (error) {
            log(error);
            return false;
        }
    }
};

export default JobPostingService;
