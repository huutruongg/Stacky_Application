import { Server } from "socket.io";
import NotificationRepository from "../repositories/NotificationRepository";
type ConnectedUsers = Record<string, string>;
export default class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    sendNotification = async (io: Server, connectedUsers: ConnectedUsers, message: string, userIds: string[]) => {
        await Promise.all(
            userIds.map(async (userId) => {
                await this.notificationRepository.createNotification({ userId, message });
                const socketId = connectedUsers[userId];
                if (socketId) {
                    const unreadCount = await this.getUnreadCount(userId);

                    io.to(socketId).emit("notification", {
                        message,
                        unreadCount,
                    });
                }
            })
        );
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