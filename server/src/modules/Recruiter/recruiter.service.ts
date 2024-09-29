import { PrismaClient, Recruiter, SensitiveInfo, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import UserRole from '../../types/IUserRole';
import { log } from 'console';
const saltRounds = 10;
const prisma = new PrismaClient();

const RecruiterService = {
    // Recruiter
    getRecruiters: async (): Promise<Recruiter[]> => {
        return await prisma.recruiter.findMany();
    },

    getRecruiterById: async (id: string): Promise<Recruiter | null> => {
        return await prisma.recruiter.findUnique({
            where: { recruiterId: id }
        });
    },

    getRecruiterByEmail: async (email: string): Promise<{ user: User; recruiter: Recruiter; sensitiveInfo?: SensitiveInfo } | null> => {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                recruiter: true,
                sensitiveInfo: true
            },
        });
        if (!user || !user.recruiter || !user.sensitiveInfo) {
            return null;
        }
        const recruiter = user.recruiter;
        const sensitiveInfo = user.sensitiveInfo;
        return { user, recruiter, sensitiveInfo };
    },


    createRecruiter: async (email: string, mobile: string, password: string, tax_number: string, org_name: string, org_field: string, org_scale: string, org_address: string): Promise<Recruiter> => {
        const hashedPwd = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
            data: {
                email,
                phoneNumber: mobile,
                role: UserRole.RECRUITER,
                sensitiveInfo: {
                    create: {
                        password: hashedPwd,
                    }
                }
            }
        });

        return await prisma.recruiter.create({
            data: {
                userId: user.userId,
                orgName: org_name,
                orgField: org_field,
                orgScale: org_scale,
                orgTaxNumber: tax_number,
                orgAddress: org_address
            }
        })
    },

    changePassword: async (userId: string, newPassword: string): Promise<void> => {
        try {
            const hashedPwd = await bcrypt.hash(newPassword, saltRounds);
            await prisma.sensitiveInfo.update({
                where: { userId: userId },
                data: { password: hashedPwd },
            })
        } catch (error) {

        }
    }
};

RecruiterService.getRecruiterByEmail("conghuu1423@gmail.com").then((data) => log(data)).catch((e) => log(e))
export default RecruiterService;
