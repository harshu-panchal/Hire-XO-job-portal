import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestor extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    compensation: string;
    amount?: string;
    equity?: string;
    details?: any;
    views?: number;
    type: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    category: "Investor";
    investorType?: "want-to-invest" | "want-investment";
    investmentAmount?: string;
    investmentSector?: string[];
    duration?: string;
    urgency?: "Immediate" | "Within Week" | "Flexible";
    postedAt: Date;
    images?: string[];
    status?: "Active" | "Inactive";
}

const InvestorSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String },
    location: { type: String, required: true },
    compensation: { type: String, required: true },
    amount: { type: String },
    equity: { type: String },
    details: { type: Schema.Types.Mixed },
    views: { type: Number, default: 0 },
    type: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    category: { type: String, default: "Investor" },
    investorType: { type: String },
    investmentAmount: { type: String },
    investmentSector: [{ type: String }],
    duration: { type: String },
    urgency: { type: String, enum: ["Immediate", "Within Week", "Flexible"] },
    images: [{ type: String }],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, { timestamps: { createdAt: 'postedAt', updatedAt: 'updatedAt' } });

// Optimize resource queries by user
InvestorSchema.index({ userId: 1, postedAt: -1 });

export default mongoose.model<IInvestor>('Investor', InvestorSchema);
