import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateTemplate extends Document {
    name: string;
    roleType: 'employee' | 'employer' | 'resource' | 'all';
    htmlTemplate: string;
    isActive: boolean;
}

const CertificateTemplateSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    roleType: {
        type: String,
        enum: ['employee', 'employer', 'resource', 'all'],
        default: 'all'
    },
    htmlTemplate: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

CertificateTemplateSchema.index({ roleType: 1, isActive: 1 });

export default mongoose.model<ICertificateTemplate>('CertificateTemplate', CertificateTemplateSchema);
