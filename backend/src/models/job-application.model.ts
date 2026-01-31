import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
    applicantId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    status: 'Pending' | 'Accepted' | 'Rejected';
    message?: string;
    appliedAt: Date;
}

const JobApplicationSchema: Schema = new Schema({
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    message: { type: String },
}, { timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' } });

// Prevent duplicate applications
JobApplicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
