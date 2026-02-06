import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for nested objects to matching the User profile structure
interface IEducation {
    school: string;
    degree: string;
    period: string;
}

interface IExperience {
    company: string;
    role: string;
    period: string;
}

export interface IJobSeeker extends Document {
    userId: mongoose.Types.ObjectId;
    education: IEducation[];
    age: number;
    experience: IExperience[];
    interestedCompanies: string[];
    cv?: string;
}

const JobSeekerSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    education: [{
        school: String,
        degree: String,
        period: String
    }],
    age: { type: Number },
    experience: [{
        company: String,
        role: String,
        period: String
    }],
    interestedCompanies: [{ type: String }],
    cv: { type: String },
}, { timestamps: true });

export default mongoose.model<IJobSeeker>('JobSeeker', JobSeekerSchema);
