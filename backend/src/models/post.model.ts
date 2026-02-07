import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    userId: mongoose.Types.ObjectId;
    content: string;
    contactDetail?: string;
    email?: string;
    phoneNumber?: string;
    resume?: string;
    images?: string[];
    likes: mongoose.Types.ObjectId[]; // Array of user IDs who liked
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    contactDetail: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    resume: { type: String },
    images: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Index for better query performance
PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>('Post', PostSchema);
