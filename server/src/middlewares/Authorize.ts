// middleware/authorize.ts
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums/EUserRole";
import { log } from "console";

export const authorizeJWT = (...allowedRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userInfo = await (req as any).userData;
        log('userInfo', userInfo);
        // Check if user data exists
        if (!userInfo) {
            res.status(401).json({ message: "Authentication required!" });
            return;
        }
        const userRole: UserRole | undefined = userInfo.role;
        // Check if the user's role is allowed
        if (userRole && allowedRoles.includes(userRole)) {
            return next(); // Proceed to the next middleware
        }
        // If the role is not allowed, return a 403 error
        res.status(403).json({ message: "You are not allowed to access this resource!" });
    };
};

