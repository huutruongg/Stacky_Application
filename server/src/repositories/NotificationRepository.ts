import { INotification } from "../interfaces/INotification";
import NotificationModel from "../models/NotificationModel";
import { BaseRepository } from "./BaseRepository";

export default class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(NotificationModel);
    }

    async getNotifications(userId: string): Promise<INotification[]> {
        return await this.model.find({ userId }).lean().exec();
    }

    async createNotification(data: Partial<INotification>): Promise<INotification> {
        return await this.model.create(data);
    }

    async deleteNotification(notificationId: string): Promise<INotification | null> {
        return this.model.findByIdAndDelete(notificationId).exec();
    }

    async markAllAsRead(userId: string): Promise<boolean> {
        const result = await this.model.updateMany({ userId }, { unread: false }).lean().exec();
        return !!result;
    }
}