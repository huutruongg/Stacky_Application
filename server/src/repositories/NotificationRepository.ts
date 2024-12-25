import { Types } from "mongoose";
import { INotification } from "../interfaces/INotification";
import NotificationModel from "../models/NotificationModel";
import { BaseRepository } from "./BaseRepository";
import { log } from "console";

export default class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(NotificationModel);
    }

    public getNotifications = async (userId: string): Promise<INotification[]> => {
        log("Getting notifications for user", userId);
        return this.model.find({ userId: new Types.ObjectId(userId) }).lean().exec();
    };

    public createNotification = async (userId: string, message: string, jobTitle: string): Promise<INotification> => {
        return this.model.create({ userId: new Types.ObjectId(userId), message, jobTitle });
    };

    public deleteNotification = async (notificationId: string): Promise<INotification | null> => {
        return this.model.findByIdAndDelete(notificationId).exec();
    };

    public markAllAsRead = async (userId: string): Promise<boolean> => {
        const result = await this.model.updateMany({ userId: new Types.ObjectId(userId) }, { unread: false }).lean().exec();
        return result.modifiedCount > 0;
    };
}