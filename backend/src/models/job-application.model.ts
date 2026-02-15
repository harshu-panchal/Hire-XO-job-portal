import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
    applicantId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    status: 'Pending' | 'Accepted' | 'InterviewScheduled' | 'Rejected' | 'SLAExpired';
    message?: string;
    resume?: string;
    additionalDocuments?: string[];
    verificationPlanId?: mongoose.Types.ObjectId;
    verificationMaxScheduleDays?: number;
    appliedAt: Date;
}

const JobApplicationSchema: Schema = new Schema({
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'InterviewScheduled', 'Rejected', 'SLAExpired'], default: 'Pending' },
    message: { type: String },
    resume: { type: String },
    additionalDocuments: [{ type: String }],
    verificationPlanId: { type: Schema.Types.ObjectId },
    verificationMaxScheduleDays: { type: Number, min: 1 },
}, { timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' } });

// Prevent duplicate applications
JobApplicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });
JobApplicationSchema.index({ jobId: 1 }); // Optimize queries by jobId
// Optimize queries by applicant and status
JobApplicationSchema.index({ applicantId: 1, status: 1 });

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
