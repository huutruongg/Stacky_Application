import { UserDataType } from '../utils/types/UserType';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { CustomRequest } from "../utils//types/Custom";
dotenv.config();

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(403).setHeader('Location', 'api/login');
        res.send(`
                    <html>
                    <head>
                        <meta http-equiv="refresh" content="3;url=/login" />
                    </head>
                    <body>
                        <p>Unauthorized: Invalid token. Redirecting to login page in 3 seconds...</p>
                    </body>
                    </html>
                `);
        return;
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY as string, (err, user) => {
            if (err) {
                res.status(403).setHeader('Location', 'api/login');
                res.send(`
                    <html>
                    <head>
                        <meta http-equiv="refresh" content="3;url=/login" />
                    </head>
                    <body>
                        <p>Unauthorized: Invalid token. Redirecting to login page in 3 seconds...</p>
                    </body>
                    </html>
                `);
                return;
            }

            (req as CustomRequest).userData = user as UserDataType;
            console.log((req as CustomRequest).userData.role)
            next();
        })
    } catch (error) {
        res.status(401).json({ message: "Authentication failed!" });
        return;
    }
}

export default authenticate;
