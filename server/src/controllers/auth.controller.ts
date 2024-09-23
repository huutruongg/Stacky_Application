import { AuthUserType } from '../utils/types/Custom';
import { Response, Request, NextFunction } from "express"
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import dotenv from 'dotenv';
import { log } from 'console';
import { Recruiter } from '@prisma/client';
import passport from 'passport';

dotenv.config();


const AuthController = {
    signupRecruiter: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, mobile, password, tax_number, org_name, org_field, org_scale, org_address, org_image_url } = req.body;
        try {
            // Check if the user exists
            const existingUser: AuthUserType | null = await UserService.getRecuiterByEmail(email);
            if (existingUser) {
                res.status(401).json({ message: "This email has existing! Please entered other email." });
                return;
            }
            const recruiter: Recruiter | null = await UserService.createRecruiter(email, mobile, password, tax_number, org_name, org_field, org_scale, org_address, org_image_url);

            if (!recruiter) {
                res.status(500).json({ message: "Failed to create recruiter." });
                return;
            }

            // Generate JWT token
            const token = AuthService.generateToken(recruiter.recruiter_id, recruiter.org_email, recruiter.role)
            // Send response
            res.status(200).json({
                success: true,
                data: {
                    userId: recruiter.recruiter_id,
                    email: recruiter.org_email,
                    token: token
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
            // Await the result of the promise
            const existingUser: Recruiter | null = await UserService.getRecuiterByEmail(email);

            // Check if the user exists
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }

            const isValidPasswod = await AuthService.checkPassword(password, existingUser.org_password);
            log("Check role: ", existingUser.role)
            // Check password
            if (!isValidPasswod) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            } else {
                // Generate JWT token
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
            }

        } catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    },

    loginCandidateOAuthGoogle: (req: Request, res: Response, next: NextFunction): void => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            if (err) {
                return next(err); // Xử lý lỗi xác thực
            }
            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication failed' });
            }

            const jwtToken = AuthService.generateToken(user.candidate_id, user.email, user.role);
            res.status(200).json({ success: true, token: jwtToken });
        })(req, res, next);


    },

    loginCandidateOAuthGithub: (req: Request, res: Response, next: NextFunction): void => {
        passport.authenticate('github', (err: any, user: any) => {
            if (err) {
                return next(err); // Handle the authentication error
            }
            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication failed' });
            }

            // Generate the JWT token
            const jwtToken = AuthService.generateToken(user.candidate_id, user.email, user.role);

            // Respond with the JWT token
            res.status(200).json({ success: true, token: jwtToken });
        })(req, res, next);
    },


    logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie("token");
            res.status(200).json({ message: "Logged out successfully" });
        });
    }
}

export default AuthController;