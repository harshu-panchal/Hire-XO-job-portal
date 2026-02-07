import Transaction from '../models/transaction.model';
import User from '../models/user.model';
import mongoose from 'mongoose';

export class WalletService {
    /**
     * Get user balance and transaction history
     */
    public async getWalletData(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);

        return {
            balance: user.walletBalance || 0,
            transactions
        };
    }

    /**
     * Simulated Top-up (since actual payment gateway is not integrated)
     */
    public async topUp(userId: string, amount: number) {
        if (amount <= 0) throw new Error('Amount must be greater than zero');

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Log transaction
            await Transaction.create([{
                userId,
                type: 'topup',
                amount,
                description: 'Wallet Top-up'
            }], { session });

            // Update user balance
            const user = await User.findByIdAndUpdate(
                userId,
                { $inc: { walletBalance: amount } },
                { new: true, session }
            );

            await session.commitTransaction();
            return { balance: user?.walletBalance || 0 };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Deduct funds for services (e.g., job postings)
     */
    public async deductFunds(userId: string, amount: number, description: string) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        if ((user.walletBalance || 0) < amount) {
            throw new Error('Insufficient wallet balance');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Transaction.create([{
                userId,
                type: 'deduction',
                amount,
                description
            }], { session });

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $inc: { walletBalance: -amount } },
                { new: true, session }
            );

            await session.commitTransaction();
            return { balance: updatedUser?.walletBalance || 0 };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
