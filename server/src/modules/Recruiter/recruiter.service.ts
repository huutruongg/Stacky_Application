import bcrypt from "bcrypt";
import UserRole from '../../types/EnumUserRole';
import { log } from 'console';
import { Recruiter } from '../../models/recruiter.model';
import { IRecruiter } from '../../types/IRecruiter';
const saltRounds = 10;

const RecruiterService = {
    getRecruiters: async (): Promise<IRecruiter[]> => {
        try {
            const recruiters = await Recruiter.find().exec();
            return recruiters;
        } catch (error) {
            console.error('Error fetching recruiters:', error);
            throw new Error('Failed to fetch recruiters');
        }
    },

    getRecruiterById: async (id: string): Promise<IRecruiter | null> => {
        try {
            const recruiter = await Recruiter.findById(id).exec();
            if (!recruiter) {
                return null;
            }
            return recruiter;
        } catch (error) {
            console.error('Error fetching recruiter by ID:', error);
            throw new Error('Failed to fetch recruiter by ID');
        }
    },

    getRecruiterByEmail: async (email: string): Promise<IRecruiter | null> => {
        try {
            const recruiter = await Recruiter.findOne({ email }).exec();
            if (!recruiter) {
                return null;
            }
            return recruiter;
        } catch (error) {
            console.error('Error finding recruiter by email:', error);
            return null;
        }
    },

    createRecruiter: async (
        email: string,
        phoneNumber: string,
        password: string,
        orgTaxNumber: string,
        orgName: string,
        orgField: string,
        orgScale: string,
        orgAddress: string
    ): Promise<IRecruiter> => {
        try {
            const hashedPwd = await bcrypt.hash(password, saltRounds);
            const recruiter = new Recruiter({
                email,
                phoneNumber,
                password: hashedPwd,
                orgName,
                orgField,
                orgScale,
                orgTaxNumber,
                orgAddress,
                role: UserRole.RECRUITER,
                createdAt: new Date()
            });
            await recruiter.save();
            return recruiter;
        } catch (error) {
            console.error('Error creating recruiter:', error);
            throw new Error('Failed to create recruiter');
        }
    },


};

export default RecruiterService;
