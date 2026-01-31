import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    salary: string;
    type: "Full-time" | "Part-time" | "Contract" | "Freelance";
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    category: string;
    postedAt: Date;
}

const JobSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Freelance"], required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    category: { type: String, required: true },
}, { timestamps: { createdAt: 'postedAt', updatedAt: 'updatedAt' } });

// Indexes for performance optimization
JobSchema.index({ location: 1 });
JobSchema.index({ type: 1 });
JobSchema.index({ category: 1 });
JobSchema.index({ userId: 1 });


export default mongoose.model<IJob>('Job', JobSchema);
