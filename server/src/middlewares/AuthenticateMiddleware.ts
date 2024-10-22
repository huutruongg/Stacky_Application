import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import AuthService from "../services/AuthService";
import { IUserDataType } from "../interfaces/IUserData";
import { IUser } from "../interfaces/IUser";
import { log } from "console";

dotenv.config();

// Helper function to set cookies for authentication (tokens)
export const setAuthCookies = async (req: Request, res: Response, user: IUser): Promise<void> => {
    const authService = new AuthService();
    const accessToken = await authService.generateAccessToken(String(user._id), user.privateEmail, user.role);
    const refreshToken = await authService.generateRefreshToken(String(user._id), user.privateEmail, user.role);
    // Set accessToken as a cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refreshToken as a cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    (req as any).userData = { userId: String(user._id), role: user.role, } as IUserDataType;
};

// JWT Authentication Middleware
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies['accessToken'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Authentication required!" });
        return;
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string, (err: any, decodedToken: any) => {
        if (err) {
            res.status(401).json({ message: "Authentication failed!" });
            return;
        }
        // Attach decoded user data to the request object
        (req as any).userData = decodedToken as IUserDataType;

        // Move to the next middleware
        next();
    });
};
