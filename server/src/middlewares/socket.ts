// middleware/socketMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { io } from '../server.local';
import { connectedUsers } from '../utils/connectedSocket';

export const socketMiddleware = (req: Request, res: Response, next: NextFunction) => {
    (req as any).io = io; // Gắn socket io
    (req as any).connectedUsers = connectedUsers;
    next();
};
