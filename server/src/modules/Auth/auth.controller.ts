import { Response, Request, NextFunction } from "express";
import dotenv from 'dotenv';
import { log } from 'console';
import passport from 'passport';
import AuthService from './auth.service';
import { AuthUserType } from "../../types/Custom";
import RecruiterService from "../Recruiter/recruiter.service";
import { Recruiter } from "@prisma/client";

dotenv.config();

const AuthController = {
    signupRecruiter: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, mobile, password, tax_number, org_name, org_field, org_scale, org_address, org_image_url } = req.body;

        try {
            const existingUser: AuthUserType | null = await RecruiterService.getRecruiterByEmail(email);
            if (existingUser) {
                res.status(401).json({ message: "This email already exists! Please enter another email." });
                return;
            }

            const recruiter: Recruiter | null = await RecruiterService.createRecruiter(
                email, mobile, password, tax_number, org_name, org_field, org_scale, org_address, org_image_url
            );

            if (!recruiter) {
                res.status(500).json({ message: "Failed to create recruiter." });
                return;
            }

            const token = AuthService.generateToken(recruiter.recruiter_id, recruiter.org_email, recruiter.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: recruiter.recruiter_id,
                    email: recruiter.org_email,
                    token,
                },
            });

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    },

    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;

        try {
            const existingUser: Recruiter | null = await RecruiterService.getRecruiterByEmail(email);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }

            const isValidPassword = await AuthService.checkPassword(password, existingUser.org_password);
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            const jwtToken = AuthService.generateToken(existingUser.recruiter_id as string, existingUser.org_email, existingUser.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: existingUser.recruiter_id,
                    email: existingUser.org_email,
                    role: existingUser.role,
                    token: jwtToken,
                },
            });

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    },

    loginCandidateOAuth: (provider: 'google' | 'github') => (req: Request, res: Response, next: NextFunction): void => {
        passport.authenticate(provider, { session: false }, (err: any, user: any) => {
            if (err || !user) {
                return res.status(401).json({ success: false, message: 'Authentication failed' });
            }

            const jwtToken = AuthService.generateToken(user.candidate_id, user.email, user.role);
            return res.status(200).json({ success: true, token: jwtToken });
        })(req, res, next);
    },

    logout: async (req: Request, res: Response): Promise<void> => {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ success: false, message: 'Something went wrong!' });
                return;
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ success: true, message: 'Logout successfull!' });
            return;
        });
    }
}

export default AuthController;
