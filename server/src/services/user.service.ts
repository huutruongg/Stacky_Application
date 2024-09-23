import { Candidate, Oauth_Token, PrismaClient, Recruiter } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { log } from 'console';
import UserRole from '../utils/types/IUserRole';
const saltRounds = 10;
const prisma = new PrismaClient()

const UserService = {
    getAllCandidates: async (): Promise<Candidate[] | null> => {
        const allUsers: Candidate[] | null = await prisma.candidate.findMany();
        console.log(allUsers);

        return allUsers;
    },

    getCandidateById: async (id: string): Promise<Candidate | null> => {
        const User: Candidate | null = await prisma.candidate.findUnique({
            where: {
                candidate_id: id
            }
        }
        )
        return User;
    },

    getCandidateByEmail: async (email: string): Promise<Candidate | null> => {
        const User: Candidate | null = await prisma.candidate.findUnique({
            where: {
                email: email
            }
        }
        )
        return User;
    },

    createCandidate: async (email: string, username: string, provider: string): Promise<Candidate> => {
        try {

            const candidate_id: string = uuidv4();
            return await prisma.candidate.create({
                data: {
                    candidate_id: candidate_id,
                    email,
                    username,
                    provider,
                    role: UserRole.CANDIDATE
                }
            });
        } catch (error) {
            throw new Error("Error saving user to database");
        }
    },

    updateOauth: async (provider: string, provider_id: string, access_token: string, candidate_id: string): Promise<void> => {
        try {
            // Check if provider info exists
            const existingProvider: Oauth_Token | null = await prisma.oauth_Token.findFirst({
                where: {
                    candidate_id: candidate_id,
                    provider: provider
                },
            });

            if (existingProvider) {
                // Update existing provider info
                await prisma.oauth_Token.update({
                    where: { token_id: existingProvider.token_id },
                    data: {
                        access_token: access_token,
                        created_at: new Date()
                    },
                });
            } else {
                // Insert new provider info
                await prisma.oauth_Token.create({
                    data: {
                        provider: provider,
                        provider_id: provider_id,
                        access_token: access_token,
                        candidate_id: candidate_id
                    },
                });
            }
        } catch (err) {
            console.error(err);
            throw new Error('Failed to update or create OAuth token');
        }
    },

    // Recruiter
    getAllRecuiters: async (): Promise<Recruiter[] | null> => {
        const allUsers: Recruiter[] | null = await prisma.recruiter.findMany();
        console.log(allUsers);

        return allUsers;
    },

    getRecruiterById: async (id: string): Promise<Recruiter | null> => {
        const User: Recruiter | null = await prisma.recruiter.findUnique({
            where: {
                recruiter_id: id
            }
        }
        )
        return User;
    },

    getRecuiterByEmail: async (email: string): Promise<Recruiter | null> => {
        const User: Recruiter | null = await prisma.recruiter.findUnique({
            where: {
                org_email: email
            }
        }
        )
        return User;
    },

    createRecruiter: async (email: string, mobile: string, password: string, tax_number: string, org_name: string, org_field: string, org_scale: string, org_address: string, org_image_url: string): Promise<Recruiter | null> => {
        const recruiter_id: string = uuidv4();
        const hashedPwd = bcrypt.hashSync(password, saltRounds);
        const recruiter = await prisma.recruiter.create({
            data: {
                recruiter_id,
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
        })
        return recruiter;
    },

    updateUser: async (id: string, email: string, username: string, pwd: string, role: string): Promise<void> => {
        const hashedPwd = await bcrypt.hashSync(pwd, saltRounds);
        await prisma.candidate.update({
            where: { candidate_id: id },
            data: {
                email,
                username,
                role
            }
        })
    },

    updateProfile: async (id: string, email: string, username: string, pwd: string): Promise<void> => {
        await prisma.candidate.update({
            where: { candidate_id: id },
            data: {
                email,
                username,
            }
        })
    },

    deleteUser: async (id: string): Promise<void> => {
        await prisma.candidate.delete({
            where: {
                candidate_id: id
            }
        })
    },

    getBooksByPage: async (page: number, pageSize: number): Promise<Candidate[] | null> => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const Users: Candidate[] | null = await prisma.candidate.findMany();
        return Users.slice(startIndex, endIndex);
    }
}



export default UserService