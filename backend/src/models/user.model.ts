import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'employee' | 'employer' | 'resource' | 'admin';
    phoneNumber?: string;
    profilePhoto?: string;
    interviewSuccessRate?: number;
    walletBalance?: number;
    activeSubscriptionId?: string;
    subscriptionExpiry?: Date;
    interviewTierId?: string;
    interviewTierExpiry?: Date;
    bookmarks: mongoose.Types.ObjectId[];
    profile: {
        bio?: string;
        skills?: string[];
        experience?: Array<{ company: string; role: string; period: string }>;
        education?: Array<{ school: string; degree: string; period: string }>;
        preferences?: {
            notifications?: boolean;
            theme?: string;
            notificationSettings?: any;
        };
        linkedinUrl?: string;
        githubUrl?: string;
        twitterUrl?: string;
        company?: string;
        jobTitle?: string;
        website?: string;
        about?: string;
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
    fcmTokens?: string[];
    mobileFcmTokens?: string[];
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'employer', 'resource', 'admin'], required: true },
    phoneNumber: { type: String },
    profilePhoto: { type: String },
    interviewSuccessRate: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    activeSubscriptionId: { type: String },
    subscriptionExpiry: { type: Date },
    interviewTierId: { type: String },
    interviewTierExpiry: { type: Date },
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
        preferences: {
            notifications: { type: Boolean, default: true },
            theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
            notificationSettings: { type: Schema.Types.Mixed }
        },
        linkedinUrl: { type: String },
        githubUrl: { type: String },
        twitterUrl: { type: String },
        // Role specific fields
        company: { type: String },
        jobTitle: { type: String },
        website: { type: String },
        about: { type: String },
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
    fcmTokens: [{ type: String }],
    mobileFcmTokens: [{ type: String }],
}, { timestamps: true });

// Cascade delete profiles when a user is deleted
UserSchema.pre('findOneAndDelete', async function () {
    try {
        const doc = await this.model.findOne(this.getQuery());
        if (doc) {
            // Delete associated profiles using imported models to avoid TS errors
            // Delete associated profiles using imported models to avoid TS errors
            // Use explicit any to bypass TypeScript limitations with dynamic model access
            const JobSeeker: any = mongoose.models.JobSeeker || mongoose.model('JobSeeker');
            const Recruiter: any = mongoose.models.Recruiter || mongoose.model('Recruiter');
            const ResourceProfile: any = mongoose.models.ResourceProfile || mongoose.model('ResourceProfile');

            if (JobSeeker) await JobSeeker.deleteMany({ userId: doc._id });
            if (Recruiter) await Recruiter.deleteMany({ userId: doc._id });
            if (ResourceProfile) await ResourceProfile.deleteMany({ userId: doc._id });

            // Note: We are currently NOT cascading delete for Jobs or Applications 
            // to preserve legacy data for analytics, unless explicitly required.
        }
    } catch (error: any) {
        throw error;
    }
});

export default mongoose.model<IUser>('User', UserSchema);

