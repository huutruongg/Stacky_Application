import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { CustomRequest, UserDataType } from "../utils/types/Custom";
dotenv.config();

const authenticate = (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
        // Lấy token từ headers
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            // Nếu không có token, trả về lỗi 401 và dừng hàm tại đây
            return res.status(401).json({ message: "Authentication required!" });
        }

        // Xác minh token
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) {
                // Nếu token không hợp lệ, trả về lỗi 401 và dừng hàm tại đây
                return res.status(401).json({ message: "Authentication failed!" });
            }

            // Gán user data vào request
            (req as CustomRequest).userData = user as UserDataType;
            console.log((req as CustomRequest).userData.role);

            // Chuyển đến middleware tiếp theo
            next();
        });
    } catch (error) {
        // Bắt mọi lỗi không mong muốn và trả về lỗi 401
        res.status(401).json({ message: "Authentication failed!" });
    }
};

export default authenticate;
