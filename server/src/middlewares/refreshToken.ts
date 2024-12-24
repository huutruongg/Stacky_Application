import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { log } from "console";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

interface CustomRequest extends Request {
    user?: JwtPayload | string;
}

const refreshToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies["accessToken"];
    log("accessToken in gen: ", accessToken);

    if (accessToken) {
        try {
            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
            next();
            return;
        } catch (err) {
            log("Access token expired or invalid");
        }
    }

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ success: false, message: "No refresh token provided. Re-authentication required!" });
        return;
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string, async (err: any, decodedRefresh: any) => {
            if (err) {
                res.status(403).json({ error: "Invalid refresh token" });
                return;
            }

            const newAccessToken = jwt.sign(
                {
                    userId: decodedRefresh.userId,
                    role: decodedRefresh.role,
                    jti: uuidv4(),
                },
                process.env.JWT_ACCESS_TOKEN_SECRET as string,
                { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || "30m" }
            );

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                maxAge: 30 * 60 * 1000,
            });

            (req as any).userData = decodedRefresh;
            next();
        });
    } catch (err) {
        res.status(403).json({ error: "Failed to refresh token" });
    }
};

export default refreshToken;
