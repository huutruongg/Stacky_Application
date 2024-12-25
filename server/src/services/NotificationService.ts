import JobPostModel from "../models/JobPostModel";
import RecruiterModel from "../models/RecruiterModel";
import NotificationRepository from "../repositories/NotificationRepository";

export default class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor(notificationRepository: NotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public sendNotification = async (io: any, connectedUsers: any, message: string, userIds: string[], jobPostId: string): Promise<void> => {
        // const jobTitle = await JobPostModel.findById({ jobPostId }).select("jobTitle").lean().exec();
        // if (!jobTitle) {
        //     return;
        // }
        // await Promise.all(
        //     userIds.map(async (userId) => {
        //         await this.notificationRepository.createNotification({ userId, message, jobTitle });
        //         const socketId = connectedUsers[userId];
        //         if (socketId) {
        //             const unreadCount = await this.getUnreadCount(userId);
        //             io.to(socketId).emit("notification", { message, unreadCount });
        //         }
        //     })
        // );
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
