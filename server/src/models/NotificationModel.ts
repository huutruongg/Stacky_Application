import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/INotification";

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    jobTitle: { type: String, required: true },
    unread: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true, default: Date.now }
})

const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
export default NotificationModel;