import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotionPlan extends Document {
    name: string;
    price: number;
    duration: number; // in days
    estimatedReachMin: number;
    estimatedReachMax: number;
    priority: number; // Higher number = higher visibility
    features: string[];
    isMostPopular: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PromotionPlanSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    estimatedReachMin: {
        type: Number,
        required: true,
        min: 0
    },
    estimatedReachMax: {
        type: Number,
        required: true,
        min: 0
    },
    priority: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 10
    },
    features: {
        type: [String],
        default: []
    },
    isMostPopular: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
PromotionPlanSchema.index({ isActive: 1, priority: -1 });

export default mongoose.model<IPromotionPlan>('PromotionPlan', PromotionPlanSchema);
