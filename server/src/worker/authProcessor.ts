import AuthController from '../modules/Auth/auth.controller';
import { NextFunction, Request, Response } from 'express';

export const authProcessor = async (req: Request, res: Response, next: NextFunction) => {
    switch (true) {
        case req.url.includes('/login/admin') && req.method === 'POST':
            await AuthController.adminLogin(req, res, next);
            break;

        case req.url.includes('/signup/recruiter') && req.method === 'POST':
            await AuthController.signupRecruiter(req, res, next);
            break;

        case req.url.includes('/login/recruiter') && req.method === 'POST':
            await AuthController.recruiterLogin(req, res, next);
            break;

        case req.url.includes('/google/callback') && req.method === 'GET':
            await AuthController.loginCandidateOAuth('google')(req, res, next);
            break;

        case req.url.includes('/github/callback') && req.method === 'GET':
            await AuthController.loginCandidateOAuth('github')(req, res, next);
            break;

        case req.url.includes('/regenerate-access-token') && req.method === 'POST':
            await AuthController.regenerateAccessToken(req, res);
            break;

        case req.url.includes('/get-access-token') && req.method === 'GET':
            AuthController.getAccessToken(req, res);
            break;

        case req.url.includes('/logout') && req.method === 'POST':
            await AuthController.logout(req, res);
            break;

        default:
            throw new Error('No matching auth route found!');
    }
};
