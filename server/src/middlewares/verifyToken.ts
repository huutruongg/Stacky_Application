// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import dotenv from "dotenv";
// import { log } from "console";
// import { isTokenRevoked } from "../utils/blackListToken";
// dotenv.config();

// interface CustomRequest extends Request {
//     user?: JwtPayload | string;
// }

// const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const accessToken = req.cookies["accessToken"];
//         log("accessToken in verify: ", accessToken);
//         if (!accessToken) {
//             return next();
//         }

//         const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
//             ignoreExpiration: true,
//         }) as jwt.JwtPayload;

//         const revoked = await isTokenRevoked(decoded.jti as string);
//         if (revoked) {
//             res.status(401).json({ error: "Token has been revoked" });
//             return;
//         }

//         if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
//             res.status(401).json({ error: "Token expired, re-authentication required" });
//             return;
//         }

//         (req as CustomRequest).user = decoded;
//         next();
//     } catch (err) {
//         log(err);
//         res.status(401).json({ error: "Invalid or expired token" });
//     }
// }

// export default verifyToken;
