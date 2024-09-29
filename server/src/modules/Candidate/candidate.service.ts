import { v4 as uuidv4 } from 'uuid';
import { Candidate, Certificate, Education, Experience, Language, OauthToken, PrismaClient, Project, PublicProfile, User } from "@prisma/client";
import UserRole from '../../types/IUserRole';
import { CandidateInfo } from '../../types/ICandidateInfo';

const prisma = new PrismaClient();

const CandidateService = {
    getFullCandidateInfo: async (user: User, candidate: Candidate, publicProfile?: PublicProfile, oauthToken?: OauthToken, project?: Project, language?: Language, certificate?: Certificate, education?: Education, experience?: Experience): Promise<CandidateInfo> => {
        return {
            user,
            candidate,
            publicProfile,
            oauthToken,
            project,
            language,
            certificate,
            education,
            experience
        }
    },

    getCandidates: async (): Promise<CandidateInfo[] | null> => {
        const candidates = await prisma.candidate.findMany({
            include: {
                user: {
                    include: {
                        publicProfile: true,
                    },
                },
            },
        });
        if (!candidates) {
            return null;
        }
        const candidateInfos = await Promise.all(
            candidates.map(async (candidate) => {
                const { user, ...restCandidate } = candidate;
                if (!user || !user.publicProfile) {
                    return null;
                }
                return await CandidateService.getFullCandidateInfo(
                    user,
                    restCandidate,
                    user.publicProfile
                );
            })
        );
        return candidateInfos.filter(info => info !== null) as CandidateInfo[];
    },

    getCandidateById: async (id: string): Promise<CandidateInfo | null> => {
        // Truy xuất candidate
        const candidate = await prisma.candidate.findUnique({
            where: { candidateId: id }
        });

        if (!candidate) {
            return null;
        }

        const [user, publicProfile] = await Promise.all([
            prisma.user.findUnique({
                where: { userId: candidate.userId }
            }),
            prisma.publicProfile.findUnique({
                where: { userId: candidate.userId }
            })
        ]);

        if (!user || !publicProfile) {
            return null;
        }

        const data = await CandidateService.getFullCandidateInfo(
            user,
            candidate,
            publicProfile
        );
        return data;
    },



    getCandidateByEmail: async (email: string): Promise<CandidateInfo | null> => {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                candidate: true,
            }
        });
        if (!user || !user.candidate) {
            return null;
        }
        const publicProfile = await prisma.publicProfile.findUnique({
            where: { userId: user.userId }
        })
        if (!publicProfile) {
            return null;
        }
        const data = await CandidateService.getFullCandidateInfo(
            user,
            user.candidate,
            publicProfile
        );
        return data;
    },


    getCandidatesApplied: async (jobId: string): Promise<{ candidate: Candidate; appliedAt: Date }[] | null> => {
        const applications = await prisma.application.findMany({
            where: { jobId: jobId },
            include: {
                candidate: true
            }
        });

        if (applications.length === 0) {
            return null;
        }

        const result = applications.map(application => ({
            candidate: application.candidate,
            appliedAt: application.appliedAt
        }));
        return result;
    },

    createCandidate: async (email: string, username: string): Promise<CandidateInfo> => {
        const userPromise = prisma.user.create({
            data: {
                email: email,
                role: UserRole.CANDIDATE,
            },
        });
        const user = await userPromise;

        const [candidate, publicProfile] = await Promise.all([
            prisma.candidate.create({
                data: {
                    userId: user.userId,
                },
            }),
            prisma.publicProfile.create({
                data: {
                    fullName: username,
                    userId: user.userId,
                },
            }),
        ]);
        const data = await CandidateService.getFullCandidateInfo(user, candidate, publicProfile);
        return data;
    },


    updateOauth: async (provider: string, providerId: string, accessToken: string, candidateId: string): Promise<void> => {
        const data = {
            accessToken: accessToken,
            createdAt: new Date(),
        };

        await prisma.oauthToken.upsert({
            where: {
                candidateId_provider: { candidateId: candidateId, provider }
            },
            update: data,
            create: {
                provider,
                providerId: providerId,
                ...data,
                candidateId: candidateId,
            },
        });
    },

    updateCandidatePersonalProfile: async (

    ): Promise<void> => {

    },

    updateCandidateProfessionalProfile: async (): Promise<void> => {

    },

    getCandidatesByPage: async (page: number, pageSize: number): Promise<Candidate[]> => {
        return await prisma.candidate.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize
        });
    },

    getUrlReposSharedByCandidateId: async (id: string): Promise<string[] | null> => {
        const projects = await prisma.project.findMany({
            where: { candidateId: id },
            select: { urlRepo: true }
        });
        const urls = projects
            .map(p => p.urlRepo)
            .filter((url): url is string => url !== null);
        return urls.length > 0 ? urls : null;
    },

    getAccessTokenGithub: async (id: string): Promise<string | null> => {
        try {
            const { accessToken } = await prisma.oauthToken.findFirst({
                where: {
                    candidateId: id,
                    provider: "GITHUB"
                },
                select: { accessToken: true }
            }) || {}; // Use destructuring to handle the case where data is null

            return accessToken || null; // Return access_token or null if it doesn't exist
        } catch (error) {
            console.error("Error fetching GitHub access token:", error);
            return null; // Return null if there's an error
        }
    }
};

export default CandidateService;
