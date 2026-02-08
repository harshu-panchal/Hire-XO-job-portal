import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceApplication extends Document {
    applicantId: mongoose.Types.ObjectId;
    resourceId: mongoose.Types.ObjectId;
    resourceType: 'Investor' | 'Tender' | 'Equipment' | 'Machinery' | 'PMC' | 'CSM' | 'Logistics' | 'Vehicle';
    status: 'Pending' | 'Accepted' | 'Rejected';
    bidAmount?: number;
    coverLetter?: string;
    message?: string; // Kept for backward compatibility
    proposalDocuments?: string[];
    appliedAt: Date;
}

const ResourceApplicationSchema: Schema = new Schema({
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true, refPath: 'resourceType' },
    resourceType: {
        type: String,
        enum: ['Investor', 'Tender', 'Equipment', 'Machinery', 'PMC', 'CSM', 'Logistics', 'Vehicle'],
        required: true
    },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    bidAmount: { type: Number },
    coverLetter: { type: String },
    message: { type: String },
    proposalDocuments: [{ type: String }],
}, { timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' } });

// Prevent duplicate applications
ResourceApplicationSchema.index({ applicantId: 1, resourceId: 1, resourceType: 1 }, { unique: true });
ResourceApplicationSchema.index({ resourceId: 1, resourceType: 1 }); // Optimize queries by resource

export default mongoose.model<IResourceApplication>('ResourceApplication', ResourceApplicationSchema);
