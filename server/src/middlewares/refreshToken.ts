
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();
import { v4 as uuidv4 } from 'uuid';

interface CustomRequest extends Request {
    user?: JwtPayload | string;
}

async function refreshToken(req: CustomRequest, res: Response, next: NextFunction) {
    // Kiểm tra xem có accessToken hợp lệ hay không
    const accessToken = await req.cookies["accessToken"]
    log("accessToken in gen: ", accessToken);
    if (accessToken) {
        try {
            // Xác thực accessToken
            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
            // Nếu accessToken hợp lệ, tiếp tục qua middleware tiếp theo
            next();
            return;
        } catch (err) {
            // Nếu accessToken hết hạn, tiếp tục thực hiện với refreshToken
            throw err;
        }
    }

    // Nếu không có accessToken hoặc accessToken hết hạn, xử lý với refreshToken
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ success: false, message: "No refresh token provided. Re-authentication required!" });
        return;
    }

    try {
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET as string,
            async (err: any, decodedRefresh: any) => {
                if (err) {
                    res.status(403).json({ error: "Invalid refresh token" });
                    return;
                }

                // Tạo mới accessToken
                const newAccessToken = jwt.sign(
                    {
                        userId: decodedRefresh.userId,
                        role: decodedRefresh.role,
                        jti: uuidv4(),
                    },
                    process.env.JWT_ACCESS_TOKEN_SECRET as string,
                    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || "30m" }
                );

                // Lưu accessToken mới vào cookie
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                    maxAge: 30 * 60 * 1000, // 30 phút
                });

                (req as any).userData = decodedRefresh;
                next();
                return;
            }
        );
    } catch (err) {
        res.status(403).json({ error: "Failed to refresh token" });
        return;
    }
}


export default refreshToken;