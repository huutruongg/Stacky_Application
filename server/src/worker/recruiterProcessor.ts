import RecruiterController from "../modules/Recruiter/recruiter.controller";
import { Request, Response } from "express";

export const recruiterProcessor = async (req: Request, res: Response) => {
    switch (true) {
        case req.url.includes('/forgot-password') && req.method === 'POST':
            await RecruiterController.forgotPassword(req, res);
            break;

        case req.url.includes('/reset-password/:userId') && req.method === 'POST':
            await RecruiterController.resetPassword(req, res);
            break;

        case req.url.includes('/change-password/:userId') && req.method === 'POST':
            await RecruiterController.resetPassword(req, res);
            break;

        case req.url.includes('/get-company-info/:recruiterId') && req.method === 'GET':
            await RecruiterController.getCompanyInfo(req, res);
            break;

        default:
            throw new Error('No matching recruiter route found!');
    }
}