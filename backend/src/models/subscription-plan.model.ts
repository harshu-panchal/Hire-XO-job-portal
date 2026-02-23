import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
    name: string;
    price: number;
    durationDays: number;
    description: string;
    features: string[];
    type: 'job-seeker' | 'employer' | 'resource';
    certificateEligible?: boolean;
    maxScheduleDays?: number;
    isActive: boolean;
    razorpayPlanId?: string;
}

const SubscriptionPlanSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    type: { type: String, enum: ['job-seeker', 'employer', 'resource'], default: 'employer' },
    certificateEligible: { type: Boolean, default: true },
    maxScheduleDays: { type: Number, min: 1 },
    isActive: { type: Boolean, default: true },
    razorpayPlanId: { type: String }
}, { timestamps: true });

export default mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
