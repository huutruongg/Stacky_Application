
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { log } from 'console';
import { IAdmin } from '../../types/IAdmin';

import UserRole from '../../types/EnumUserRole';

import { IUser } from '../../types/IUser';
import { User } from '../../models/user.model';
import { Admin } from '../../models/admin.model';
import { Candidate } from '../../models/candidate.model';


const saltRounds = 10;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const AuthService = {

    checkPassword: async (pwdRequest: string, hashedPwd: string): Promise<boolean> => {
        try {
            return await bcrypt.compare(pwdRequest, hashedPwd);
        } catch (error) {
            console.error('Password comparison failed:', error);
            return false;
        }
    },

    generateAccessToken: (userId: string, email: string, role: string): string => {
        const payload = { userId, email, role };
        return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
    },

    generateRefreshToken: (userId: string, email: string, role: string): string => {
        const payload = { userId, email, role };
        return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET as string, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
    },

    verifyRefreshToken: (refreshToken: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string, (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    },

    verifyOAuthToken: async (provider: string, token: string) => {
        if (provider !== 'google') {
            throw new Error('Unsupported provider');
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Invalid Google token');
            }

            return {
                email: payload.email,
                name: payload.name,
                provider,
                token,
            };
        } catch (error) {
            console.error('OAuth token verification failed:', error);
            throw new Error('Token verification failed');
        }
    },

    saveRefreshToken: async (userId: string, refreshToken: string): Promise<boolean | null> => {
        try {
            await User.findByIdAndUpdate(userId, { refreshToken });
            return true;
        } catch (error) {
            log(error);
            return false;
        }
    },

    deleteRefreshTokenByUserId: async (userId: string): Promise<boolean> => {
        try {
            await User.findByIdAndUpdate(userId, { refreshToken: null }).exec();
            return true;
        } catch (error) {
            log(error);
            return false;
        }
    },

    createAdmin: async (privateEmail: string, password: string): Promise<IAdmin | null> => {
        try {
            const hashedPassword = await AuthService.hashPassword(password);
            const user = await AuthService.saveUser(privateEmail, hashedPassword, UserRole.ADMIN);
            if (!user) throw new Error('Failed to create admin user');

            const admin = new Admin({ userId: user._id });
            await admin.save();
            return admin;
        } catch (error) {
            console.error('Error creating admin:', error);
            return null;
        }
    },

    changePassword: async (userId: string, newPassword: string, role: string): Promise<void> => {
        try {
            const hashedPwd = await AuthService.hashPassword(newPassword);
            await User.findByIdAndUpdate(userId, { password: hashedPwd }).exec();
        } catch (error) {
            console.error('Error updating password:', error);
            throw new Error("Password update failed");
        }
    },

    hashPassword: async (password: string): Promise<string> => {
        return await bcrypt.hash(password, saltRounds);
    },

    getUserById: async (userId: string): Promise<IUser | null> => {
        try {
            return await User.findById(userId).exec();
        } catch (error) {
            console.error('Error finding user by ID:', error);
            return null;
        }
    },

    getUserByRefreshToken: async (refreshToken: string): Promise<IUser | null> => {
        try {
            return await User.findOne({ refreshToken }).exec();
        } catch (error) {
            console.error('Error finding user by ID:', error);
            return null;
        }
    },

    getUserByEmail: async (email: string): Promise<IUser | null> => {
        try {
            return await User.findOne({ privateEmail: email }).exec();
        } catch (error) {
            console.error('Error finding user by email:', error);
            return null;
        }
    },

    createCandidateUser: async (privateEmail: string, fullName: string): Promise<IUser | null> => {
        try {
            const user = await AuthService.saveUser(privateEmail, '', UserRole.CANDIDATE); // No password for OAuth
            if (!user) throw new Error('Failed to create candidate user');

            const candidate = new Candidate({
                userId: user._id,
                fullName
            });
            await candidate.save();
            return user;
        } catch (error) {
            console.error('Error creating candidate user:', error);
            return null;
        }
    },

    // Helper function to save a user
    saveUser: async (privateEmail: string, password: string, role: string): Promise<IUser | null> => {
        try {
            const user = new User({
                privateEmail,
                password,
                role
            });
            await user.save();
            return user;
        } catch (error) {
            console.error('Error saving user:', error);
            return null;
        }
    }
};


export default AuthService;
