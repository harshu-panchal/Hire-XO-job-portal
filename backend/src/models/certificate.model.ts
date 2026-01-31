import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    issueDate: Date;
    expiryDate: Date;
    successRate: number;
    status: 'Active' | 'Expired';
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
    }
}, { timestamps: true });

// Index for efficient queries
CertificateSchema.index({ userId: 1, status: 1 });

// Method to update status based on expiry date
CertificateSchema.methods.updateStatus = function () {
    this.status = new Date() < this.expiryDate ? 'Active' : 'Expired';
    return this.save();
};

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
