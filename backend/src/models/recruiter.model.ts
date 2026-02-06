import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiter extends Document {
    userId: mongoose.Types.ObjectId;
    company: string;
    companyLogo?: string;
    experience: string;
}

const RecruiterSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    company: { type: String, required: true },
    companyLogo: { type: String },
    experience: { type: String },
}, { timestamps: true });

export default mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);

