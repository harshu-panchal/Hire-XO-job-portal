import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'job-seeker' | 'recruiter' | 'resource' | 'admin';
    phoneNumber?: string;
    profilePhoto?: string;
    interviewSuccessRate?: number;
    walletBalance?: number;
    activeSubscriptionId?: string;
    subscriptionExpiry?: Date;
    bookmarks: mongoose.Types.ObjectId[];
    status?: 'active' | 'suspended' | 'banned' | 'deleted';
    statusReason?: string;
    statusUpdatedAt?: Date;
    deletedAt?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['job-seeker', 'recruiter', 'resource', 'admin'], required: true },
    phoneNumber: { type: String },
    profilePhoto: { type: String },
    interviewSuccessRate: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    activeSubscriptionId: { type: String },
    subscriptionExpiry: { type: Date },
    bookmarks: [{ type: Schema.Types.ObjectId, default: [] }],
    status: { type: String, enum: ['active', 'suspended', 'banned', 'deleted'], default: 'active' },
    statusReason: { type: String },
    statusUpdatedAt: { type: Date },
    deletedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);

