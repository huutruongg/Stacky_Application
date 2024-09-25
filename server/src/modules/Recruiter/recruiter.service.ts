import { PrismaClient, Recruiter } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import UserRole from '../../types/IUserRole';
const saltRounds = 10;
const prisma = new PrismaClient();

const Recruiter = {
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
    }
};

export default Recruiter;
