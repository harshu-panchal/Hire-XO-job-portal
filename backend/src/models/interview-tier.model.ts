import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewTier extends Document {
    name: string;
    price: number;
    durationDays: number;
    maxScheduleDays: number;
    description: string;
    features: string[];
    order: number;
    isActive: boolean;
    razorpayPlanId?: string;
}

const InterviewTierSchema = new Schema<IInterviewTier>({
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1 },
    maxScheduleDays: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    features: [{ type: String }],
    order: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    razorpayPlanId: { type: String }
}, { timestamps: true });

InterviewTierSchema.index({ isActive: 1, order: 1, maxScheduleDays: 1 });

export default mongoose.model<IInterviewTier>('InterviewTier', InterviewTierSchema);
