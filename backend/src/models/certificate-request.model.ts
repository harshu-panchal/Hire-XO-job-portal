import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateRequest extends Document {
    userId: mongoose.Types.ObjectId;
    subscriptionId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    role: string;
    status: 'pending' | 'issued' | 'rejected';
    requestedAt: Date;
    processedAt?: Date;
    processedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
}

const CertificateRequestSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: Schema.Types.ObjectId, required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    role: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'issued', 'rejected'],
        default: 'pending'
    },
    requestedAt: { type: Date, default: Date.now, required: true },
    processedAt: { type: Date },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String }
}, { timestamps: true });

CertificateRequestSchema.index({ status: 1, requestedAt: -1 });
CertificateRequestSchema.index({ subscriptionId: 1 }, { unique: true });

export default mongoose.model<ICertificateRequest>('CertificateRequest', CertificateRequestSchema);
