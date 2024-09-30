// middleware/authorize.ts
import { Request, Response, NextFunction } from "express";
import UserRole from "../types/EnumUserRole";
import { CustomRequest } from "../types/Custom";

const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userData = (req as CustomRequest).userData;
        // Check if user data exists
        if (!userData) {
            res.status(401).json({ message: "Authentication required!" });
            return;
        }
        const userRole: UserRole | undefined = userData.role;
        // Check if the user's role is allowed
        if (userRole && allowedRoles.includes(userRole)) {
            return next(); // Proceed to the next middleware
        }
        // If the role is not allowed, return a 403 error
        res.status(403).json({ message: "You are not allowed to access this resource!" });
    };
};

export default authorize;
