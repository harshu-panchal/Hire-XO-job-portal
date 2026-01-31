import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
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
    category: "Vehicles";
    vehicleType?: "rent-out-vehicles" | "rent-vehicles";
    vehicleTypes?: string[];
    duration?: string;
    urgency?: "Immediate" | "Within Week" | "Flexible";
    postedAt: Date;
}

const VehicleSchema: Schema = new Schema({
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
    category: { type: String, default: "Vehicles" },
    vehicleType: { type: String },
    vehicleTypes: [{ type: String }],
    duration: { type: String },
    urgency: { type: String, enum: ["Immediate", "Within Week", "Flexible"] },
}, { timestamps: { createdAt: 'postedAt', updatedAt: 'updatedAt' } });

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);
