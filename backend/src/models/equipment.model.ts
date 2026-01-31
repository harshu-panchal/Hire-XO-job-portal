import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    compensation: string;
    type: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    category: "Equipments";
    equipmentType?: "rent-out-equipment" | "rent-equipment";
    equipmentTypes?: string[];
    duration?: string;
    urgency?: "Immediate" | "Within Week" | "Flexible";
    postedAt: Date;
}

const EquipmentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String },
    location: { type: String, required: true },
    compensation: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    category: { type: String, default: "Equipments" },
    equipmentType: { type: String },
    equipmentTypes: [{ type: String }],
    duration: { type: String },
    urgency: { type: String, enum: ["Immediate", "Within Week", "Flexible"] },
}, { timestamps: { createdAt: 'postedAt', updatedAt: 'updatedAt' } });

export default mongoose.model<IEquipment>('Equipment', EquipmentSchema);
