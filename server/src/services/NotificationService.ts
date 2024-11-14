import NotificationRepository from "../repositories/NotificationRepository";
import {io} from '../server.local';
export default class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    addNotification = async (userId: string, message: string) => {
        const notification = await this.notificationRepository.createNotification({ userId, message });
        io.to(userId).emit('new-notification', {
            message: notification.message,
            unreadCount: await this.getUnreadCount(userId),
          });
        return notification;
    }

    getAllNotifications = async (userId: string) => {
        return await this.notificationRepository.getNotifications(userId);
    }

    getUnreadCount = async (userId: string) => {
        return (await this.notificationRepository.getNotifications(userId)).filter(notification => notification.unread).length;
    }

    markAllAsRead = async (userId: string) => {
        await this.notificationRepository.markAllAsRead(userId);
    }
}