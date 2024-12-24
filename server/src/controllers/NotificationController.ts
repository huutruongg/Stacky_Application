import NotificationService from "../services/NotificationService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export default class NotificationController extends BaseController {
    private notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        super();
        this.notificationService = notificationService;
    }

    public createNotification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userIds, message } = req.body;
            await this.notificationService.sendNotification((req as any).io, (req as any).connectedUsers, message, userIds);
            this.sendResponse(res, 200, { success: true, message: 'Notification added successfully' });
        } catch (error: any) {
            this.sendError(res, 500, error.message);
        }
    }

    public getAllNotifications = async (req: Request, res: Response): Promise<void> => {
        try {
            const userInfo = (req as any).userData;
            if (!userInfo) {
                this.sendError(res, 400, 'Incredentials not found');
                return;
            }
            const notifications = await this.notificationService.getAllNotifications(userInfo.userId);
            this.sendResponse(res, 200, { notifications });
        } catch (error: any) {
            this.sendError(res, 500, error.message);
        }
    }

    public getUnreadCount = async (req: Request, res: Response): Promise<void> => {
        try {
            const userInfo = (req as any).userData;
            if (!userInfo) {
                this.sendError(res, 400, 'Incredentials not found');
                return;
            }
            const count = await this.notificationService.getUnreadCount(userInfo.userId);
            this.sendResponse(res, 200, { count });
        } catch (error: any) {
            this.sendError(res, 500, error.message);
        }
    }

    public markAllAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const userInfo = (req as any).userData;
            if (!userInfo) {
                this.sendError(res, 400, 'Incredentials not found');
                return;
            }
            await this.notificationService.markAllAsRead(userInfo.userId);
            this.sendResponse(res, 200, { success: true, message: 'All notifications marked as read' });
        } catch (error: any) {
            this.sendError(res, 500, error.message);
        }
    }
}