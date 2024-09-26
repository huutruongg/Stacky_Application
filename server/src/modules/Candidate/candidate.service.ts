import { v4 as uuidv4 } from 'uuid';
import { C_Project, Candidate, PrismaClient } from "@prisma/client";
import UserRole from '../../types/IUserRole';

const prisma = new PrismaClient();

const CandidateService = {
    getCandidates: async (): Promise<Candidate[]> => {
        return await prisma.candidate.findMany();
    },

    getCandidateById: async (id: string): Promise<Candidate | null> => {
        return await prisma.candidate.findUnique({
            where: { candidate_id: id }
        });
    },

    getCandidateByEmail: async (email: string): Promise<Candidate | null> => {
        return await prisma.candidate.findUnique({
            where: { email }
        });
    },

    getCandidatesApplied: async (jobId: string): Promise<{ candidate: Candidate; appliedAt: Date }[] | null> => {
        const applications = await prisma.application.findMany({
            where: { job_id: jobId },
            include: {
                candidate: true
            }
        });

        if (applications.length === 0) {
            return null;
        }

        const result = applications.map(application => ({
            candidate: application.candidate,
            appliedAt: application.applied_at
        }));

        return result;
    },

    createCandidate: async (email: string, username: string): Promise<Candidate> => {
        const candidateId = uuidv4();
        return await prisma.candidate.create({
            data: {
                candidate_id: candidateId,
                email,
                username,
                role: UserRole.CANDIDATE
            }
        });
    },

    updateOauth: async (provider: string, providerId: string, accessToken: string, candidateId: string): Promise<void> => {
        const data = {
            access_token: accessToken,
            created_at: new Date(),
        };

        await prisma.oauth_Token.upsert({
            where: {
                candidate_id_provider: { candidate_id: candidateId, provider }
            },
            update: data,
            create: {
                provider,
                provider_id: providerId,
                ...data,
                candidate_id: candidateId,
            },
        });
    },

    getCandidatesByPage: async (page: number, pageSize: number): Promise<Candidate[]> => {
        return await prisma.candidate.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize
        });
    },

    getUrlReposSharedByCandidateId: async (id: string): Promise<string[] | null> => {
        const projects = await prisma.c_Project.findMany({
            where: { candidate_id: id },
            select: { url_repo: true }
        });

        // Return the extracted urls or null if no projects found
        return projects.length > 0 ? projects.map(p => p.url_repo) : null;
    },

    getAccessTokenGithub: async (id: string): Promise<string | null> => {
        try {
            const { access_token } = await prisma.oauth_Token.findFirst({
                where: {
                    candidate_id: id,
                    provider: "GITHUB"
                },
                select: { access_token: true }
            }) || {}; // Use destructuring to handle the case where data is null

            return access_token || null; // Return access_token or null if it doesn't exist
        } catch (error) {
            console.error("Error fetching GitHub access token:", error);
            return null; // Return null if there's an error
        }
    }
};

export default CandidateService;
