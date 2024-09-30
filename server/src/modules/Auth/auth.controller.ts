import { Response, Request, NextFunction } from "express";
import dotenv from 'dotenv';
import passport from 'passport';
import { log } from 'console';
import AuthService from './auth.service';
import { AuthUserType } from "../../types/Custom";
import RecruiterService from "../Recruiter/recruiter.service";
import UserRole from "../../types/EnumUserRole";
import CandidateService from "../Candidate/candidate.service";
import { CandidateInfo } from "../../types/ICandidateInfo";
import { ICandidate } from "../../types/ICandidate";
import { IRecruiter } from "../../types/IRecruiter";

dotenv.config();

const AuthController = {
    signupRecruiter: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, phoneNumber, password, tax_number, org_name, org_field, org_scale, org_address } = req.body;

        try {
            const existingUser = await RecruiterService.getRecruiterByEmail(email);
            if (existingUser) {
                res.status(401).json({ message: "This email already exists! Please enter another email." });
                return;
            }

            const recruiter: IRecruiter | null = await RecruiterService.createRecruiter(
                email, phoneNumber, password, tax_number, org_name, org_field, org_scale, org_address
            );

            if (!recruiter) {
                res.status(500).json({ message: "Failed to create recruiter." });
                return;
            }

            const token = AuthService.generateToken(recruiter._id as string, email, UserRole.RECRUITER);
            res.status(200).json({
                success: true,
                data: {
                    userId: recruiter._id,
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
            const isValidPassword = await AuthService.checkPassword(password, existingUser.password);
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            const jwtToken = AuthService.generateToken(existingUser._id as string, existingUser.email, UserRole.RECRUITER);
            res.status(200).json({
                success: true,
                data: {
                    userId: existingUser._id,
                    email: existingUser.email,
                    role: UserRole.RECRUITER,
                    token: jwtToken,
                },
            });

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    },

    loginCandidateOAuth: (provider: 'google' | 'github') => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        passport.authenticate(provider, { session: false }, async (err: any, user: ICandidate) => {
            if (err || !user) {
                log(err);
                res.status(401).json({ success: false, message: 'Authentication failed' });
                return;
            }

            try {
                const candidate = await CandidateService.getCandidateById(String(user._id));
                if (!candidate) {
                    res.status(401).json({ success: false, message: 'Authentication failed' });
                    return;
                }

                const jwtToken = AuthService.generateToken(String(user._id), String(candidate.email), UserRole.CANDIDATE);
                res.status(200).json({ success: true, token: jwtToken });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        })(req, res, next);
    },

    adminLogin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        
        try {
            const { email, password } = req.body;
            const existingUser = await AuthService.getAdminAccountByEmail(email);
            // log(existingUser);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }

            const isValidPassword = await AuthService.checkPassword(password, existingUser.password);
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            const jwtToken = AuthService.generateToken(String(existingUser._id), existingUser.email, UserRole.ADMIN);
            res.status(200).json({
                success: true,
                data: {
                    userId: existingUser._id,
                    email: existingUser.email,
                    role: UserRole.ADMIN,
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
            res.status(200).json({ success: true, message: 'Logout successful!' });
        });
    }
}

export default AuthController;
