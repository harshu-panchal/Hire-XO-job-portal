import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    issueDate: Date;
    expiryDate: Date;
    successRate: number;
    status: 'Active' | 'Expired';
    verificationStatus: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    verifiedBy?: mongoose.Types.ObjectId;
    verifiedAt?: Date;
    documentUrl?: string;
    subscriptionId?: mongoose.Types.ObjectId;
    planId?: mongoose.Types.ObjectId;
    templateId?: mongoose.Types.ObjectId;
    issuedBy?: mongoose.Types.ObjectId;
    pdfUrl?: string;
    fieldPositions?: {
        category?: { x: number; y: number };
        username?: { x: number; y: number };
        certificateId?: { x: number; y: number };
        issueDate?: { x: number; y: number };
        validTill?: { x: number; y: number };
        adminNote?: { x: number; y: number };
    };
}

const CertificateSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    successRate: { type: Number, required: true, min: 0, max: 100 },
    status: {
        type: String,
        enum: ['Active', 'Expired'],
        default: 'Active'
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    documentUrl: { type: String },
    subscriptionId: { type: Schema.Types.ObjectId },
    planId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    templateId: { type: Schema.Types.ObjectId, ref: 'CertificateTemplate' },
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pdfUrl: { type: String },
    fieldPositions: {
        category: {
            x: { type: Number },
            y: { type: Number }
        },
        username: {
            x: { type: Number },
            y: { type: Number }
        },
        certificateId: {
            x: { type: Number },
            y: { type: Number }
        },
        issueDate: {
            x: { type: Number },
            y: { type: Number }
        },
        validTill: {
            x: { type: Number },
            y: { type: Number }
        },
        adminNote: {
            x: { type: Number },
            y: { type: Number }
        }
    }
}, { timestamps: true });

// Index for efficient queries
CertificateSchema.index({ userId: 1, status: 1 });
CertificateSchema.index({ subscriptionId: 1 }, { unique: true, sparse: true });

// Method to update status based on expiry date
CertificateSchema.methods.updateStatus = function () {
    this.status = new Date() < this.expiryDate ? 'Active' : 'Expired';
    return this.save();
};

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
