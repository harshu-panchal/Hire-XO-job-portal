import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    relatedId?: string;
    relatedType?: 'job_application' | 'resource_application' | 'new_job' | 'new_resource' | 'new_user';
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read: { type: Boolean, default: false },
    relatedId: { type: String },
    relatedType: { type: String, enum: ['job_application', 'resource_application', 'new_job', 'new_resource', 'new_user'] },
}, { timestamps: true });

// Optimize notification queries by user
NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
