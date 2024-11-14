import { get } from 'http';
import { authorizeJWT } from '../middlewares/Authorize';
import { authenticateJWT } from '../middlewares/Authenticate';
import RecruiterController from "../../src/controllers/RecruiterController";
import { BaseRoutes } from "./BaseRoutes";
import { UserRole } from '../../src/enums/EUserRole';
import { cacheMiddleware } from '../middlewares/CacheRedis';
import NotificationController from '../controllers/NotificationController';
import path from 'path';
import { Request, Response } from 'express';

export default class NotificationRoutes extends BaseRoutes {
    private notificationController: NotificationController;
    constructor(notificationController: NotificationController) {
        super();
        this.notificationController = notificationController;
        this.autoBindControllerMethods(this.notificationController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/notifications', this.serveNotificationsPage);
        this.router.post('/create-notification', this.notificationController.createNotification);
        this.router.get('/get-all-notifications', authenticateJWT, authorizeJWT(UserRole.CANDIDATE), this.notificationController.getAllNotifications);
        this.router.get('/unread', authenticateJWT, authorizeJWT(UserRole.CANDIDATE), this.notificationController.getUnreadCount);
        this.router.put('/mark-all-as-read', authenticateJWT, authorizeJWT(UserRole.CANDIDATE), this.notificationController.markAllAsRead);
    }

    private serveNotificationsPage(req: Request, res: Response): void {
        res.sendFile(path.join(__dirname, '../views/notifications.html'));
    }
}