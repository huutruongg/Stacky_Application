import { Admin } from './../../models/admin.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { log } from 'console';
import { IAdmin } from '../../types/IAdmin';
import { Recruiter } from '../../models/recruiter.model';
import UserRole from '../../types/EnumUserRole';
import { User } from '../../models/user.model';
import { IUser } from '../../types/IUser';
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
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRATION });
    },

    generateRefreshToken: (userId: string, email: string, role: string) => {
        const payload = { userId, email, role };
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
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

    getAdminAccountByEmail: async (email: string): Promise<IAdmin | null> => {
        try {
            const admin = await Admin.findOne({ email }).exec();
            // log(data)
            if (!admin) {
                return null;
            }
            return admin;
        } catch (error) {
            log(error);
            return null;
        }
    },

    createAdmin: async (privateEmail: string, password: string): Promise<IAdmin | null> => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user: IUser | null = new User({
                privateEmail,
                password: hashedPassword,
                role: UserRole.ADMIN
            });
            await user.save();
            const admin = new Admin({ userId: user._id })
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
            if (role === UserRole.ADMIN) {
                await Admin.updateOne(
                    { _id: userId },
                    { $set: { password: hashedPwd } }
                );
            } else if (role === UserRole.RECRUITER) {
                await Recruiter.updateOne(
                    { _id: userId },
                    { $set: { password: hashedPwd } }
                );
            } else {
                throw new Error("Invalid role provided");
            }
        } catch (error) {
            console.error('Error updating password:', error);
            throw new Error("Password update failed");
        }
    },

    hashPassword: async (password: string): Promise<string> => {
        return await bcrypt.hash(password, saltRounds);
    }
};

export default AuthService;
