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
        maxAge: 1 * 60 * 1000, // 1 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    (req as any).userData = { userId: String(user._id), role: user.role } as IUserDataType;
};

// JWT Authentication Middleware with proper refreshToken validation
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies['accessToken'] || req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'] || req.headers['x-refresh-token'];

    log('accessToken', accessToken);
    log('refreshToken', refreshToken);

    // Nếu không có accessToken, kiểm tra refreshToken
    if (!accessToken && refreshToken) {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string, async (refreshErr: any, decodedRefreshToken: any) => {
            if (refreshErr) {
                return res.status(403).json({ message: "Invalid refresh token!" });
            }

            // Tạo accessToken mới từ refreshToken
            const newAccessToken = jwt.sign(
                { userId: decodedRefreshToken.userId, role: decodedRefreshToken.role },
                process.env.JWT_ACCESS_TOKEN_SECRET as string,
                { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1m' }
            );

            // Lưu lại accessToken mới vào cookie
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 1 * 60 * 1000, // 15 phút
            });

            // Gắn thông tin người dùng vào request để tiếp tục xử lý
            (req as any).userData = decodedRefreshToken;
            return next();
        });
    } else if (accessToken) {
        // Nếu có accessToken, xác thực nó
        jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string, (err: any, decodedToken: any) => {
            if (err && err.name === 'TokenExpiredError' && refreshToken) {
                // Nếu accessToken hết hạn và có refreshToken
                jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string, async (refreshErr: any, decodedRefreshToken: any) => {
                    if (refreshErr) {
                        return res.status(403).json({ message: "Invalid refresh token!" });
                    }
                    // Tạo accessToken mới từ refreshToken
                    const newAccessToken = jwt.sign(
                        { userId: decodedRefreshToken.userId, role: decodedRefreshToken.role },
                        process.env.JWT_ACCESS_TOKEN_SECRET as string,
                        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1m' }
                    );
                    res.clearCookie('accessToken');
                    // Lưu lại accessToken mới vào cookie
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                        maxAge: 1 * 60 * 1000, // 15 phút
                    });

                    // Gắn thông tin người dùng vào request để tiếp tục xử lý
                    (req as any).userData = decodedRefreshToken;
                    return next();
                });
            } else if (err) {
                // Trường hợp accessToken không hợp lệ hoặc có lỗi khác
                return res.status(403).json({ message: "Invalid access token!" });
            } else {
                // Token hợp lệ, tiếp tục xử lý
                (req as any).userData = decodedToken;
                return next();
            }
        });
    } else {
        // Trường hợp không có accessToken hoặc refreshToken
        res.status(401).json({ message: "Authentication required!" });
        return;
    }
};