import { Response, Request, NextFunction } from "express";
import dotenv from 'dotenv';
import passport from 'passport';
import { log } from 'console';
import AuthService from './auth.service';
import RecruiterService from "../Recruiter/recruiter.service";
import UserRole from "../../types/EnumUserRole";
import { IRecruiter } from "../../types/IRecruiter";
import { IUser } from "../../types/IUser";
import { CustomSessionRequest } from "../../types/Custom";

dotenv.config();

const AuthController = {
    signupRecruiter: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { privateEmail, password, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress } = req.body;

        try {
            const existingUser = await AuthService.getUserByEmail(privateEmail);
            if (existingUser) {
                res.status(401).json({ success: false, message: "This email already exists! Please enter another email." });
                return;
            }

            const recruiter: IRecruiter | null = await RecruiterService.createRecruiter(privateEmail, password, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress);

            if (!recruiter) {
                res.status(500).json({ success: false, message: "Failed to create recruiter." });
                return;
            }

            const accessToken = AuthService.generateAccessToken(recruiter.userId as string, privateEmail, UserRole.RECRUITER);
            const refreshToken = AuthService.generateRefreshToken(recruiter.userId as string, privateEmail, UserRole.RECRUITER);
            res.status(200).json({
                userId: recruiter.userId,
                email: privateEmail,
                accessToken,
                refreshToken
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
            const existingUser: IUser | null = await AuthService.getUserByEmail(email);
            if (!existingUser) {
                res.status(401).json({ success: false, message: "User not found!" });
                return;
            }

            // Tìm Recruiter theo userId
            const user: IUser | null = await AuthService.getUserById(String(existingUser._id));
            if (!user) {
                res.status(401).json({ success: false, message: "User is not a recruiter!" });
                return;
            }

            // Kiểm tra mật khẩu
            const isValidPassword = await AuthService.checkPassword(password, String(existingUser.password));

            if (!isValidPassword) {
                res.status(401).json({ success: false, message: "Invalid credentials!" });
                return;
            }

            // Tạo JWT token
            const accessToken = AuthService.generateAccessToken(String(user._id), user.privateEmail, user.role);
            const refreshToken = AuthService.generateRefreshToken(user._id as string, user.privateEmail, user.role);
            res.status(200).json({
                userId: user._id,
                email: user.privateEmail,
                role: user.role,
                accessToken,
                refreshToken
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
                const candidate: IUser | null = await AuthService.getUserById(String(user._id));
                if (!candidate) {
                    res.status(401).json({ success: false, message: 'Authentication failed' });
                    return;
                }

                const accessToken = AuthService.generateAccessToken(String(candidate._id), candidate.privateEmail, candidate.role);
                const refreshToken = AuthService.generateRefreshToken(String(candidate._id), candidate.privateEmail, candidate.role);
                req.session.accessToken = accessToken;
                req.session.refreshToken = refreshToken;
                
                res.redirect("http://localhost:5173/account.stacky.vn?token=true");
            })(req, res, next);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    adminLogin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { email, password } = req.body;
            const existingUser = await AuthService.getUserByEmail(email);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }

            const isValidPassword = await AuthService.checkPassword(password, String(existingUser.password));
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }

            const accessToken = AuthService.generateAccessToken(String(existingUser._id), existingUser.privateEmail, existingUser.role);
            const refreshToken = AuthService.generateRefreshToken(String(existingUser._id), existingUser.privateEmail, existingUser.role);
            res.status(200).json({
                userId: existingUser._id,
                email: existingUser.privateEmail,
                role: existingUser.role,
                accessToken,
                refreshToken
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
    },
    getTokens: (req: CustomSessionRequest, res: Response) => {
        const accessToken = req.session?.accessToken;
        const refreshToken = req.session?.refreshToken;

        console.log(req.session); // Log session to troubleshoot

        if (!accessToken || !refreshToken) {
            return res.status(401).json({ success: false, message: "No tokens found" });
        }
        res.status(200).json({
            accessToken,
            refreshToken
        });
    }

}

export default AuthController;
