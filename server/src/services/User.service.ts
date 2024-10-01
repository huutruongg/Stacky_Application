import { User } from './../models/user.model';
import { IUser } from '../types/IUser';
import { log } from 'console';
import { Candidate } from '../models/candidate.model';


const UserService = {
    getUserById: async (userId: string): Promise<IUser | null> => {
        try {
            const user: IUser | null = await User.findById(userId).exec();
            return user;
        } catch (error) {
            log(error)
            return null;
        }
    },

    getUserByEmail: async (email: string): Promise<IUser | null> => {
        try {
            const user: IUser | null = await User.findOne({ email: email }).exec();
            return user;
        } catch (error) {
            log(error)
            return null;
        }
    },

    createCandidateUser: async (email: string, fullName: string): Promise<IUser | null> => {
        try {
            const user = await User.create({
                email
            })
            await Candidate.create({
                fullName,
                userId: user._id
            })
            return user;
        } catch (error) {
            log(error);
            return null;
        }
    },
}

export default UserService;

