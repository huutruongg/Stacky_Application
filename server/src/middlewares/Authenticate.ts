import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import AuthService from "../services/AuthService";
import { IUserDataType } from "../interfaces/IUserData";
import { IUser } from "../interfaces/IUser";
import { log } from "console";

dotenv.config();

export const setAuthCookies = async (req: Request, res: Response, user: IUser): Promise<void> => {
    const authService = new AuthService();
    const accessToken = await authService.generateAccessToken(String(user._id), user.role);
    const refreshToken = await authService.generateRefreshToken(String(user._id), user.role);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    (req as any).userData = { userId: String(user._id), role: user.role } as IUserDataType;
};

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // const accessToken = (await req.cookies["accessToken"]) || req.headers["authorization"]?.split(" ")[1];
    const refreshToken = (await req.cookies["refreshToken"]) || req.headers["x-refresh-token"];
    const accessToken = await req.cookies["accessToken"];
    log("accessToken", accessToken);
    log("refreshToken", refreshToken);

    // Nếu không có accessToken, kiểm tra refreshToken
    if (accessToken) {
        jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET as string,
            (err: any, decodedToken: any) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid access token!" });
                }
                (req as any).userData = decodedToken; // Gắn thông tin người dùng vào req
                return next();
            }
        );
    } else if (refreshToken) {
        // Nếu không có accessToken nhưng có refreshToken
        return next(); // Chuyển qua middleware tái tạo token
    } else {
        // Trường hợp không có accessToken và refreshToken
        res.status(401).json({ message: "Authentication required!" });
        return;
    }
};

export default authenticate;