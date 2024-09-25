import { Job_Post, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JobPostingService = {
    getJDById: async (id: string): Promise<Job_Post | null> => {
        try {
            const jobPost = await prisma.job_Post.findUnique({
                where: { job_id: id },
            });

            if (!jobPost) {
                console.warn(`Job posting with ID ${id} not found.`);
            }

            return jobPost;
        } catch (error) {
            console.error(`Error fetching job posting with ID ${id}:`, error);
            return null;
        }
    },

    findJobPostingsByJobPosition: async (key: string): Promise<Job_Post[] | null> => {
        try {
            const data: Job_Post[] | null = await prisma.job_Post.findMany({
                where: {
                    job_title: {
                        contains: key,
                        mode: 'insensitive',
                    },
                },
            });
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    filterJobPostingByLocation: async (location: string): Promise<Job_Post[] | null> => {
        try {
            const data: Job_Post[] | null = await prisma.job_Post.findMany({
                where: {
                    recruiter: {
                        org_address: location
                    }
                },
                include: {
                    recruiter: {
                        select: {
                            org_address: true,
                        }
                    }
                }
            });
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    filterJobPostingByIndustry: async (industry: string): Promise<Job_Post[] | null> => {
        try {
            const data: Job_Post[] | null = await prisma.job_Post.findMany({
                where: {
                    type_of_industry: industry
                },
            });
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getAllJobsPosted: async (userId: string): Promise<Job_Post[] | null> => {
        try {
            return await prisma.job_Post.findMany({
                where: {
                    recruiter_id: userId
                }
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getAllJobPostingsByPage: async (page: number, pageSize: number): Promise<Job_Post[] | null> => {
        try {
            return await prisma.job_Post.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    deleteJobPosting: async (jobId: string): Promise<boolean | null> => {
        try {
            await prisma.job_Post.delete({
                where: {
                    job_id: jobId
                }
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

export default JobPostingService;
