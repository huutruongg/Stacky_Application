import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

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

    generateToken: (userId: string, email: string, role: string): string => {
        const payload = { userId, email, role };
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
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
};

export default AuthService;
