
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { Candidate, PrismaClient } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient()

const AuthService = {
    checkPassword: async (pwdRequest: string, hashedPwd: string): Promise<boolean> => {
        try {
            return await bcrypt.compare(pwdRequest, hashedPwd);
        } catch (error) {
            return false;
        }
    },

    generateToken: (userId: string, email: string, role: string) => {
        const payload = { userId, email, role };
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    },

    verifyOAuthToken: async (provider: string, token: string) => {
        if (provider === 'google') {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) throw new Error('Invalid Google token');
            return {
                email: payload.email,
                name: payload.name,
                provider,
                token
                // Các thông tin khác từ Google
            };
        }
        // Xử lý thêm cho GitHub hoặc các OAuth provider khác
    },
}

export default AuthService;

