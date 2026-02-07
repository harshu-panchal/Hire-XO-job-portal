import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
    applicationId: mongoose.Types.ObjectId;
    applicationType: 'JobApplication' | 'ResourceApplication';
    jobId?: mongoose.Types.ObjectId;
    resourceId?: mongoose.Types.ObjectId;
    resourceType?: string;
    applicantId: mongoose.Types.ObjectId;
    employerId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
    time: string;
    type: 'Remote' | 'On-site';
    location?: string;
    link?: string;
    status: 'scheduled' | 'pending' | 'completed' | 'cancelled';
    createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
    applicationId: { type: Schema.Types.ObjectId, required: true, refPath: 'applicationType' },
    applicationType: { type: String, required: true, enum: ['JobApplication', 'ResourceApplication'] },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    resourceId: { type: Schema.Types.ObjectId },
    resourceType: { type: String },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ['Remote', 'On-site'], default: 'Remote' },
    location: { type: String },
    link: { type: String },
    status: { type: String, enum: ['scheduled', 'pending', 'completed', 'cancelled'], default: 'scheduled' },
}, { timestamps: true });

export default mongoose.model<IInterview>('Interview', InterviewSchema);
