import bcrypt from "bcrypt";
import UserRole from '../../types/EnumUserRole';
import { Recruiter } from '../../models/recruiter.model';
import { User } from '../../models/user.model';
import { IRecruiter } from '../../types/IRecruiter';
import { log } from "console";
import { refreshToken } from "firebase-admin/app";

const saltRounds = 10;

// Helper function to find recruiter
const handleFindRecruiter = async (criteria: any, errorMessage: string): Promise<IRecruiter | null> => {
    try {
        const recruiter = await Recruiter.findById(criteria).exec();
        log(recruiter, criteria);
        return recruiter;
    } catch (error) {
        console.error(errorMessage, error);
        throw new Error(errorMessage);
    }
};

// Helper function to create user
const createUser = async (privateEmail: string, hashedPwd: string, phoneNumber: string) => {
    try {
        const user = new User({
            privateEmail,
            password: hashedPwd,
            role: UserRole.RECRUITER,
            phoneNumber
        });
        await user.save();
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
};

// Helper function to create recruiter
const createRecruiter = async ({
    userId,
    phoneNumber,
    orgTaxNumber,
    orgName,
    orgField,
    orgScale,
    orgAddress
}: {
    userId: string;
    phoneNumber: string;
    orgTaxNumber: string;
    orgName: string;
    orgField: string;
    orgScale: string;
    orgAddress: string;
}): Promise<IRecruiter> => {
    try {
        const recruiter = new Recruiter({
            userId,
            phoneNumber,
            orgTaxNumber,
            orgName,
            orgField,
            orgScale,
            orgAddress,
            createdAt: new Date()
        });
        await recruiter.save();
        return recruiter;
    } catch (error) {
        console.error('Error creating recruiter:', error);
        throw new Error('Failed to create recruiter');
    }
};

const RecruiterService = {
    getRecruiterById: async (recruiterId: string): Promise<IRecruiter | null> => {
        return handleFindRecruiter(recruiterId, 'Error fetching recruiter by userId');
    },

    getRecruiterByEmail: async (privateEmail: string): Promise<IRecruiter | null> => {
        const user = await User.findOne({ privateEmail }).select('_id').exec();
        if (!user) return null;
        const userId = user._id;
        return handleFindRecruiter({userId}, 'Error fetching recruiter by email');
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
            const user = await createUser(privateEmail, hashedPwd, phoneNumber);
            log("user", user);
            const recruiter = await createRecruiter({
                userId: String(user._id),
                phoneNumber,
                orgTaxNumber,
                orgName,
                orgField,
                orgScale,
                orgAddress
            });
            log("recruiter", recruiter);
            return recruiter;
        } catch (error) {
            console.error('Error creating recruiter:', error);
            throw new Error('Failed to create recruiter');
        }
    },
};

export default RecruiterService;
