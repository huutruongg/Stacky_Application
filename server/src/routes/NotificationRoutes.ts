import path from 'path';
import { Request, Response } from 'express';
import { cacheMiddleware } from '../middlewares/CacheRedis';
import NotificationController from '../controllers/NotificationController';
import { BaseRoutes } from './BaseRoutes';
import { socketMiddleware } from '../middlewares/socket';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import verifyToken from '../middlewares/verifyToken';
import refreshToken from '../middlewares/refreshToken';

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
            verifyToken, refreshToken, authenticate, authorize(['getAllNotifications']),
            this.notificationController.getAllNotifications
        );

        this.router.get(
            '/unread',
            verifyToken, refreshToken, authenticate, authorize(['getUnreadCount']),
            this.notificationController.getUnreadCount
        );

        this.router.put(
            '/mark-all-as-read',
            verifyToken, refreshToken, authenticate, authorize(['markAllAsRead']),
            this.notificationController.markAllAsRead
        );

        // Admin or recruiter routes for creating notifications
        this.router.post(
            '/create-notification',
            verifyToken, refreshToken, authenticate, authorize(['createNotification']), socketMiddleware,
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
