import bcrypt from "bcrypt";
import UserRole from '../../types/EnumUserRole';
import { Recruiter } from '../../models/recruiter.model';
import { User } from '../../models/user.model';
import { IRecruiter } from '../../types/IRecruiter';

const saltRounds = 10;

const RecruiterService = {
    getRecruiterByUserId: async (userId: string) => {
        try {
            const recruiter = await Recruiter.findOne({ userId }).populate('userId');
            return recruiter;
        } catch (error) {
            throw new Error('Error fetching recruiter');
        }
    },

    getRecruiterByEmail: async (email: string): Promise<IRecruiter | null> => {
        try {
            const recruiter = await Recruiter.findOne({ email }).populate('userId');
            return recruiter;
        } catch (error) {
            throw new Error('Error fetching recruiter');
        }
    },
    createRecruiter: async (
        privateEmail: string,
        password: string,
        phoneNumber: string,
        orgTaxNumber: string,
        orgName: string,
        orgField: string,
        orgScale: string,
        orgAddress: string,
    ): Promise<IRecruiter> => {
        try {
            const hashedPwd = await bcrypt.hash(password, saltRounds);

            // Tạo User trước
            const user = new User({
                privateEmail, 
                password: hashedPwd,
                role: UserRole.RECRUITER,
                phoneNumber,
            });
            await user.save(); // Lưu User trước

            // Tạo Recruiter và liên kết với User
            const recruiter = new Recruiter({
                userId: user._id,
                phoneNumber,
                orgName,
                orgField,
                orgScale,
                orgTaxNumber,
                orgAddress,
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
