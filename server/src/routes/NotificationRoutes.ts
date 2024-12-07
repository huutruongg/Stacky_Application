import path from 'path';
import { Request, Response } from 'express';
import { authenticateJWT } from '../middlewares/Authenticate';
import { authorize } from '../middlewares/Authorize';
import { cacheMiddleware } from '../middlewares/CacheRedis';
import NotificationController from '../controllers/NotificationController';
import { BaseRoutes } from './BaseRoutes';
import { socketMiddleware } from '../middlewares/socket';

export default class NotificationRoutes extends BaseRoutes {
    private notificationController: NotificationController;

    constructor(notificationController: NotificationController) {
        super();
        this.notificationController = notificationController;
        this.autoBindControllerMethods(this.notificationController);
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Public route for viewing notifications page
        this.router.get('/notifications', this.serveNotificationsPage);

        // Candidate-specific routes
        this.router.get(
            '/get-all-notifications',
            authenticateJWT,
            // authorize(['notification:read']),
            this.notificationController.getAllNotifications
        );

        this.router.get(
            '/unread',
            authenticateJWT,
            // authorize(['notification:read']),
            this.notificationController.getUnreadCount
        );

        this.router.put(
            '/mark-all-as-read',
            authenticateJWT,
            // authorize(['notification:update']),
            this.notificationController.markAllAsRead
        );

        // Admin or recruiter routes for creating notifications
        this.router.post(
            '/create-notification',
            authenticateJWT,
            // authorize(['notification:write']),
            socketMiddleware,
            this.notificationController.createNotification
        );
    }

    private serveNotificationsPage(req: Request, res: Response): void {
        const filePath = path.join(__dirname, '../views/notifications.html');
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(500).send({ message: 'Error serving notifications page', error: err.message });
            }
        });
    }
}
