import { Response, Request, NextFunction } from "express";
import dotenv from 'dotenv';
import { log } from 'console';
import passport from 'passport';
import AuthService from './auth.service';
import { AuthUserType } from "../../types/Custom";
import RecruiterService from "../Recruiter/recruiter.service";
import { Candidate, Recruiter } from "@prisma/client";
import UserRole from "../../types/IUserRole";
import CandidateService from "../Candidate/candidate.service";
import { CandidateInfo } from "../../types/ICandidateInfo";

dotenv.config();

const AuthController = {
    signupRecruiter: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, mobile, password, tax_number, org_name, org_field, org_scale, org_address } = req.body;

        try {
            const existingUser: AuthUserType | null = await RecruiterService.getRecruiterByEmail(email);
            if (existingUser) {
                res.status(401).json({ message: "This email already exists! Please enter another email." });
                return;
            }

            const recruiter: Recruiter | null = await RecruiterService.createRecruiter(
                email, mobile, password, tax_number, org_name, org_field, org_scale, org_address
            );

            if (!recruiter) {
                res.status(500).json({ message: "Failed to create recruiter." });
                return;
            }

            const token = AuthService.generateToken(recruiter.recruiterId, email, UserRole.RECRUITER);
            res.status(200).json({
                success: true,
                data: {
                    userId: recruiter.recruiterId,
                    email: email,
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
            const existingUser = await RecruiterService.getRecruiterByEmail(email);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }
            const userPassword = existingUser.sensitiveInfo?.password as string;
            const isValidPassword = await AuthService.checkPassword(password, userPassword);
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            const jwtToken = AuthService.generateToken(existingUser.recruiter.recruiterId as string, existingUser.user.email, existingUser.user.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: existingUser.recruiter.recruiterId,
                    email: existingUser.user.email,
                    role: existingUser.user.role,
                    token: jwtToken,
                },
            });

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    },

    loginCandidateOAuth: (provider: 'google' | 'github') => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        passport.authenticate(provider, { session: false }, async (err: any, user: CandidateInfo) => {
            if (err || !user) {
                log(err)
                res.status(401).json({ success: false, message: 'Authentication failed' });
                return;
            }

            try {
                const candidate = await CandidateService.getCandidateById(user.candidate.candidateId);
                if (!candidate || !candidate.user?.email) {
                    res.status(401).json({ success: false, message: 'Authentication failed' });
                    return;
                }

                const jwtToken = AuthService.generateToken(user.candidate.candidateId, candidate.user.email, candidate.user.role);
                res.status(200).json({ success: true, token: jwtToken });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        })(req, res, next);
    },

    adminLogin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;

        try {
            const existingUser = await AuthService.getAdminAccountByEmail(email);
            log(existingUser)
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }
            const userPassword = existingUser.sensitiveInfo.password;
            const isValidPassword = await AuthService.checkPassword(password, userPassword);
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            const jwtToken = AuthService.generateToken(existingUser.user.userId, existingUser.user.email, existingUser.user.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: existingUser.user.userId,
                    email: existingUser.user.email,
                    role: existingUser.user.role,
                    token: jwtToken,
                },
            });

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
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
