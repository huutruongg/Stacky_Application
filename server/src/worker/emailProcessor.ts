
import { Request, Response } from 'express';
import EmailController from '../modules/Email/email.controller';

export const emailProcessor = async (req: Request, res: Response) => {
    switch (true) {
        case req.url.includes('/send-email') && req.method === 'POST':
            await EmailController.sendEmail(req, res);
            break;

        default:
            throw new Error('No matching Email route found!');
    }
};
