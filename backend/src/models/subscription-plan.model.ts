import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
    name: string;
    price: number;
    durationDays: number;
    description: string;
    features: string[];
    type: 'job-seeker' | 'employer' | 'resource';
    isActive: boolean;
}

const SubscriptionPlanSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    type: { type: String, enum: ['job-seeker', 'employer', 'resource'], default: 'employer' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
