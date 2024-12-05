import NotificationService from "../services/NotificationService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
export default class NotificationController extends BaseController {
    private notificationService: NotificationService;
    constructor(notificationService: NotificationService) {
        super();
        this.notificationService = notificationService;
    }

    createNotification = async (req: Request, res: Response) => {
        try {
            const { userIds, message } = req.body;
            await this.notificationService.sendNotification((req as any).io, (req as any).connectedUsers, message, userIds);
            this.sendResponse(res, 200, { success: true, message: 'Notification added successfully' });
        } catch (error : any) {
            return this.sendError(res, 500, error.message);
        }
    }

    getAllNotifications = async (req: Request, res: Response) => {
        try {
            const userInfo = (req as any).userData;
            if (!userInfo) {
                return this.sendError(res, 400, 'Incredentials not found');
            }
            const notifications = await this.notificationService.getAllNotifications(userInfo.userId);
            this.sendResponse(res, 200, { notifications });
        } catch (error : any) {
            return this.sendError(res, 500, error.message);
        }
    }

    getUnreadCount = async (req: Request, res: Response) => {
        try {
            const userInfo = (req as any).userData;
            if (!userInfo) {
                return this.sendError(res, 400, 'Incredentials not found');
            }
            const count = await this.notificationService.getUnreadCount(userInfo.userId);
            this.sendResponse(res, 200, { count });
        } catch (error : any) {
            return this.sendError(res, 500, error.message);
        }
    }

    markAllAsRead = async (req: Request, res: Response) => {
        try {
            const userInfo = (req as any).userData;
            if (!userInfo) {
                return this.sendError(res, 400, 'Incredentials not found');
            }
            await this.notificationService.markAllAsRead(userInfo.userId);
            this.sendResponse(res, 200, { success: true, message: 'All notifications marked as read' });
        } catch (error : any) {
            return this.sendError(res, 500, error.message);
        }
    }
}