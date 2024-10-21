import dotenv from 'dotenv';
dotenv.config();

export const googleOAuthConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
};

export const githubOAuthConfig = {
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: '/auth/github/callback',
    scope: ['user:email', 'repo']
};
