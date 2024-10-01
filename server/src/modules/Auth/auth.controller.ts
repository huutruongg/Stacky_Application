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
import { IUser } from "../../types/IUser";
import UserService from "../../services/User.service";

dotenv.config();

const AuthController = {
    signupRecruiter: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { privateEmail, password, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress } = req.body;

        try {
            const existingUser = await UserService.getUserByEmail(privateEmail);
            if (existingUser) {
                res.status(401).json({ message: "This email already exists! Please enter another email." });
                return;
            }

            const recruiter: IRecruiter | null = await RecruiterService.createRecruiter(privateEmail, password, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress);

            if (!recruiter) {
                res.status(500).json({ message: "Failed to create recruiter." });
                return;
            }

            const token = AuthService.generateToken(recruiter._id as string, privateEmail, UserRole.RECRUITER);
            res.status(200).json({
                success: true,
                data: {
                    userId: recruiter._id,
                    email: privateEmail,
                    token,
                },
            });

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    },

    recruiterLogin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;

        try {
            // Tìm User theo email
            const existingUser: IUser | null = await UserService.getUserByEmail(email);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }

            // Tìm Recruiter theo userId
            const user: IUser | null = await UserService.getUserById(String(existingUser._id));
            if (!user) {
                res.status(401).json({ message: "User is not a recruiter!" });
                return;
            }

            // Kiểm tra mật khẩu
            const isValidPassword = await AuthService.checkPassword(password, String(existingUser.password));

            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            // Tạo JWT token
            const jwtToken = AuthService.generateToken(String(user._id), String(user.privateEmail), user.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: user._id,
                    email: user.privateEmail,
                    role: user.role,
                    token: jwtToken,
                },
            });

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    },

    loginCandidateOAuth: (provider: 'google' | 'github') => async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            passport.authenticate(provider, { session: false }, async (err: any, user: any) => {
                if (err || !user) {
                    log(err);
                    res.status(401).json({ success: false, message: 'Authentication failed' });
                    return;
                }
                const candidate: IUser | null = await UserService.getUserById(String(user._id));
                if (!candidate) {
                    res.status(401).json({ success: false, message: 'Authentication failed' });
                    return;
                }

                const jwtToken = AuthService.generateToken(String(candidate._id), String(candidate.privateEmail), candidate.role);
                res.status(200).json({ success: true, token: jwtToken });
            })(req, res, next);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    adminLogin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { email, password } = req.body;
            const existingUser = await UserService.getUserByEmail(email);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }

            const isValidPassword = await AuthService.checkPassword(password,String( existingUser.password));
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            const jwtToken = AuthService.generateToken(String(existingUser._id), existingUser.privateEmail, existingUser.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: existingUser._id,
                    email: existingUser.privateEmail,
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
