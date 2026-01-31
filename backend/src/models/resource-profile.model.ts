import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceProfile extends Document {
    userId: mongoose.Types.ObjectId;
    organizationName: string;
    category: string;

    // Sub-types
    investorType?: string;
    tenderType?: string;
    equipmentType?: string;
    machineryType?: string;
    pmcType?: string;
    csmType?: string;
    logisticsType?: string;
    vehicleType?: string;

    // Category specific fields
    investmentAmount?: string;
    investmentSector?: string[];
    equipmentTypes?: string[];
    machineryTypes?: string[];
    vehicleTypes?: string[];
    serviceArea?: string;
    projectExperience?: number;
    certifications?: string[];
    tenderValue?: string;
    tenderCategory?: string[];
}

const ResourceProfileSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    organizationName: { type: String, required: true },
    category: { type: String, required: true },

    investorType: { type: String },
    tenderType: { type: String },
    equipmentType: { type: String },
    machineryType: { type: String },
    pmcType: { type: String },
    csmType: { type: String },
    logisticsType: { type: String },
    vehicleType: { type: String },

    investmentAmount: { type: String },
    investmentSector: [{ type: String }],
    equipmentTypes: [{ type: String }],
    machineryTypes: [{ type: String }],
    vehicleTypes: [{ type: String }],
    serviceArea: { type: String },
    projectExperience: { type: Number },
    certifications: [{ type: String }],
    tenderValue: { type: String },
    tenderCategory: [{ type: String }],
}, { timestamps: true });

// Indexes for performance optimization
ResourceProfileSchema.index({ category: 1 });
ResourceProfileSchema.index({ organizationName: 1 });
ResourceProfileSchema.index({ userId: 1 });
ResourceProfileSchema.index({ location: 1 });



export default mongoose.model<IResourceProfile>('ResourceProfile', ResourceProfileSchema);
