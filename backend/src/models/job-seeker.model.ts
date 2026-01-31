import mongoose, { Schema, Document } from 'mongoose';

export interface IJobSeeker extends Document {
    userId: mongoose.Types.ObjectId;
    education: string;
    age: number;
    experience: number;
    interestedCompanies: string[];
    cv?: string;
}

const JobSeekerSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    education: { type: String },
    age: { type: Number },
    experience: { type: Number, default: 0 },
    interestedCompanies: [{ type: String }],
    cv: { type: String },
}, { timestamps: true });

export default mongoose.model<IJobSeeker>('JobSeeker', JobSeekerSchema);
