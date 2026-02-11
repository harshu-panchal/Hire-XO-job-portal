import mongoose from 'mongoose';
import SubscriptionPlan from '../src/models/subscription-plan.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function viewPlans() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/hirexo');
        console.log('Connected to MongoDB');

        const plans = await SubscriptionPlan.find({});
        console.log('Current Subscription Plans:');
        plans.forEach(plan => {
            console.log(`- [${plan.type}] ${plan.name}: ₹${plan.price} (${plan.durationDays} days)`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

viewPlans();
