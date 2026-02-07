import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
    userId: mongoose.Types.ObjectId;
    resourceId: mongoose.Types.ObjectId;
    resourceType: 'Job' | 'Post';
    budget: number;
    estimatedReach: string;
    status: 'Active' | 'Completed' | 'Paused';
    startDate: Date;
    endDate?: Date;
}

const PromotionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true, refPath: 'resourceType' },
    resourceType: { type: String, enum: ['Job', 'Post'], required: true },
    budget: { type: Number, required: true },
    estimatedReach: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Completed', 'Paused'], default: 'Active' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
}, { timestamps: true });

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);
