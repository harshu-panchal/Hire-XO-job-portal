import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'job-seeker' | 'recruiter' | 'resource' | 'admin' | 'employee' | 'employer';
    phoneNumber?: string;
    profilePhoto?: string;
    interviewSuccessRate?: number;
    walletBalance?: number;
    activeSubscriptionId?: string;
    subscriptionExpiry?: Date;
    bookmarks: mongoose.Types.ObjectId[];
    profile: {
        bio?: string;
        skills?: string[];
        experience?: Array<{ company: string; role: string; period: string }>;
        education?: Array<{ school: string; degree: string; period: string }>;
        linkedinUrl?: string;
        githubUrl?: string;
        twitterUrl?: string;
        company?: string;
        jobTitle?: string;
        username?: string;
        age?: number;
        organizationName?: string;
        category?: string;
        investorType?: string;
        tenderType?: string;
        equipmentType?: string;
        machineryType?: string;
        pmcType?: string;
        csmType?: string;
        logisticsType?: string;
        vehicleType?: string;
        location?: string;
        investmentRange?: string;
        preferredEquity?: string;
    };
    status?: 'active' | 'suspended' | 'banned' | 'deleted';
    statusReason?: string;
    statusUpdatedAt?: Date;
    deletedAt?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['job-seeker', 'recruiter', 'resource', 'admin', 'employee', 'employer'], required: true },
    phoneNumber: { type: String },
    profilePhoto: { type: String },
    interviewSuccessRate: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    activeSubscriptionId: { type: String },
    subscriptionExpiry: { type: Date },
    bookmarks: [{ type: Schema.Types.ObjectId, default: [] }],
    // Extended profile fields
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        experience: [{
            company: String,
            role: String,
            period: String
        }],
        education: [{
            school: String,
            degree: String,
            period: String
        }],
        linkedinUrl: { type: String },
        githubUrl: { type: String },
        twitterUrl: { type: String },
        // Role specific fields
        company: { type: String },
        jobTitle: { type: String },
        username: { type: String },
        age: { type: Number },
        organizationName: { type: String },
        category: { type: String },
        investorType: { type: String },
        tenderType: { type: String },
        equipmentType: { type: String },
        machineryType: { type: String },
        pmcType: { type: String },
        csmType: { type: String },
        logisticsType: { type: String },
        vehicleType: { type: String },
        location: { type: String },
        investmentRange: { type: String },
        preferredEquity: { type: String }
    },
    status: { type: String, enum: ['active', 'suspended', 'banned', 'deleted'], default: 'active' },
    statusReason: { type: String },
    statusUpdatedAt: { type: Date },
    deletedAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);

