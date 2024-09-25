"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const userData = req.userData;
        // Check if user data exists
        if (!userData) {
            res.status(401).json({ message: "Authentication required!" });
            return;
        }
        const userRole = userData.role;
        // Check if the user's role is allowed
        if (userRole && allowedRoles.includes(userRole)) {
            return next(); // Proceed to the next middleware
        }
        // If the role is not allowed, return a 403 error
        res.status(403).json({ message: "You are not allowed to access this resource!" });
    };
};
exports.default = authorize;
