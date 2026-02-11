import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
    userId: mongoose.Types.ObjectId;
    resourceId: mongoose.Types.ObjectId;
    resourceType: 'Job' | 'Post';
    planId?: mongoose.Types.ObjectId; // Optional for backward compatibility
    budget: number; // Kept for backward compatibility
    priority: number; // Higher number = higher visibility
    estimatedReach: string;
    status: 'Active' | 'Completed' | 'Paused';
    startDate: Date;
    endDate: Date; // Required for plan-based promotions
}

const PromotionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resourceId: { type: Schema.Types.ObjectId, required: true, refPath: 'resourceType', index: true },
    resourceType: { type: String, enum: ['Job', 'Post'], required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'PromotionPlan' }, // Optional for backward compatibility
    budget: { type: Number, required: true }, // Kept for backward compatibility
    priority: { type: Number, default: 1, min: 1, max: 10 }, // Higher number = higher visibility
    estimatedReach: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Completed', 'Paused'], default: 'Active', index: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true, index: true } // Required for expiry queries
}, { timestamps: true });

// Compound index for efficient expiry queries
PromotionSchema.index({ status: 1, endDate: 1 });

// Compound index for feed sorting (status + priority + startDate)
PromotionSchema.index({ status: 1, priority: -1, startDate: -1 });

// Index for resource lookup
PromotionSchema.index({ resourceId: 1, resourceType: 1, status: 1 });

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);
