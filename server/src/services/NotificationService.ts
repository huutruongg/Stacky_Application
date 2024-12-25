import JobPostModel from "../models/JobPostModel";
import RecruiterModel from "../models/RecruiterModel";
import NotificationRepository from "../repositories/NotificationRepository";

export default class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public sendNotification = async (io: any, connectedUsers: any, message: string, userIds: string[], jobTitle: string): Promise<void> => {
        await Promise.all(
            userIds.map(async (userId) => {
                await this.notificationRepository.createNotification(userId, message, jobTitle);
                const socketId = connectedUsers[userId];
                if (socketId) {
                    const unreadCount = await this.getUnreadCount(userId);
                    io.to(socketId).emit("notification", { message, jobTitle, unreadCount });
                }
            })
        );
    }

    public getAllNotifications = async (userId: string): Promise<any[]> => {
        return await this.notificationRepository.getNotifications(userId);
    }

    public getUnreadCount = async (userId: string): Promise<number> => {
        const notifications = await this.notificationRepository.getNotifications(userId);
        return notifications.filter(notification => notification.unread).length;
    }

    public markAllAsRead = async (userId: string): Promise<void> => {
        await this.notificationRepository.markAllAsRead(userId);
    }
}
