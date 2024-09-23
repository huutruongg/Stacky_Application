import { Candidate, PrismaClient, Recruiter } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import UserRole from '../utils/types/IUserRole';

const saltRounds = 10;
const prisma = new PrismaClient();

const UserService = {
    getAllCandidates: async (): Promise<Candidate[]> => {
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

    // Recruiter
    getAllRecruiters: async (): Promise<Recruiter[]> => {
        return await prisma.recruiter.findMany();
    },

    getRecruiterById: async (id: string): Promise<Recruiter | null> => {
        return await prisma.recruiter.findUnique({
            where: { recruiter_id: id }
        });
    },

    getRecruiterByEmail: async (email: string): Promise<Recruiter | null> => {
        return await prisma.recruiter.findUnique({
            where: { org_email: email }
        });
    },

    createRecruiter: async (email: string, mobile: string, password: string, tax_number: string, org_name: string, org_field: string, org_scale: string, org_address: string, org_image_url: string): Promise<Recruiter> => {
        const recruiterId = uuidv4();
        const hashedPwd = await bcrypt.hash(password, saltRounds);
        return await prisma.recruiter.create({
            data: {
                recruiter_id: recruiterId,
                org_email: email, 
                org_mobile: mobile,
                org_password: hashedPwd,
                role: UserRole.RECRUITER,
                org_tax_number: tax_number,
                org_name,
                org_field,
                org_scale,
                org_address,
                org_image: org_image_url
            }
        });
    },

    getCandidatesByPage: async (page: number, pageSize: number): Promise<Candidate[]> => {
        return await prisma.candidate.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize
        });
    }
};

export default UserService;
