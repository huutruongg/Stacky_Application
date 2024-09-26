import { Job_Post, PrismaClient } from "@prisma/client";
import { log } from "console";
import { v4 as uuidv4 } from "uuid"
const prisma = new PrismaClient();

const JobPostingService = {


    getJobPostingById: async (id: string): Promise<Job_Post | null> => {
        try {
            const jobPost = await prisma.job_Post.findUnique({
                where: { job_id: id },
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

    getJobPostingsByRecruiter: async (recruiterId: string, postId: string): Promise<Job_Post[] | null> => {
        try {
            const jobPosts: Job_Post[] | null = await prisma.job_Post.findMany({
                where: {
                    job_id: postId,
                    recruiter_id: recruiterId
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

    getJobsSaved: async (candidateId: string, postId: string): Promise<Job_Post[] | null> => {
        try {
            const jobPosts = await prisma.job_Saved.findMany({
                where: {
                    candidate_id: candidateId,
                    job_id: postId,
                },
                include: {
                    job: true,
                },
            });

            if (!jobPosts) {
                return null;
            }
            return jobPosts.map(jobSaved => jobSaved.job);
        } catch (error) {
            log(error)
            return null;
        }
    },

    getJobsApplied: async (candidateId: string, postId: string): Promise<Job_Post[] | null> => {
        try {
            const jobPosts = await prisma.application.findMany({
                where: {
                    candidate_id: candidateId,
                    job_id: postId,
                },
                include: {
                    job: true,
                },
            });

            if (!jobPosts) {
                return null;
            }
            return jobPosts.map(jobApplied => jobApplied.job);
        } catch (error) {
            log(error)
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
            log(error);
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
            log(error);
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
            log(error);
            return null;
        }
    },

    getJobsPosted: async (userId: string): Promise<Job_Post[] | null> => {
        try {
            return await prisma.job_Post.findMany({
                where: {
                    recruiter_id: userId
                }
            });
        } catch (error) {
            log(error);
            return null;
        }
    },

    getJobPostingsByPage: async (page: number, pageSize: number): Promise<Job_Post[] | null> => {
        try {
            return await prisma.job_Post.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize
            });
        } catch (error) {
            log(error);
            return null;
        }
    },

    createJobPosting: async (recruiter_id: string, job_title: string, job_image: string, type_of_work: string, location: string, job_salary: string, candidates_limit: number, education_required: string, years_of_experience: string, type_of_industry: string,
        professional_skills: string, certificate_required: string, languages_required: string, job_benefit: string, leave_policy: string, job_description: string, work_enviroment: string, job_schedule: string, application_deadline: string): Promise<boolean | null> => {
        try {
            const job_id: string = uuidv4();
            await prisma.job_Post.create({
                data: {
                    job_id, recruiter_id, job_title, job_image, type_of_work, location, job_salary, candidates_limit, education_required,
                    years_of_experience, type_of_industry, professional_skills, certificate_required, languages_required, job_benefit,
                    leave_policy, job_description, work_enviroment, job_schedule, application_deadline
                }
            })
            return true;
        } catch (error) {
            log(error);
            return false;
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
            log(error);
            return false;
        }
    }
};

export default JobPostingService;
