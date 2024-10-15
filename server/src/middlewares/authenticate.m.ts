import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { CustomRequest } from "../types/Custom";

dotenv.config();

const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    // Extract token from headers
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Authentication required!" });
        return;
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Authentication failed!" });
        }

        // Attach user data to the request
        (req as any).userData = user;

        // Log user role for debugging
        console.log((req as CustomRequest).userData.role);

        // Move to the next middleware
        next();
    });
};

export default authenticateJWT;
