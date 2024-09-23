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
};

export default JobPostingService;
