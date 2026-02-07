import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'topup' | 'deduction';
    amount: number;
    description: string;
    createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['topup', 'deduction'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// Index for efficient user history queries
TransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
