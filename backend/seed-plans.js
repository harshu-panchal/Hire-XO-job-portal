// Seed Subscription Plans
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hire-xo';

const SubscriptionPlanSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);

const plans = [
    {
        name: 'Basic Plan',
        price: 99,
        durationDays: 30,
        description: 'Basic plan for individuals',
        features: ['Post up to 5 jobs', 'View applicants'],
        isActive: true
    },
    {
        name: 'Pro Plan',
        price: 299,
        durationDays: 90,
        description: 'Professional plan for companies',
        features: ['Unlimited job posts', 'Priority support', 'Resume search'],
        isActive: true
    },
    {
        name: 'Enterprise Plan',
        price: 999,
        durationDays: 365,
        description: 'Enterprise plan for large organizations',
        features: ['All Pro features', 'Dedicated account manager', 'API access'],
        isActive: true
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing plans
        await SubscriptionPlan.deleteMany({});
        console.log('✅ Cleared existing plans');

        // Insert new plans
        await SubscriptionPlan.insertMany(plans);
        console.log('✅ Seeded 3 subscription plans');

        await mongoose.connection.close();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Error seeding plans:', error);
        process.exit(1);
    }
}

seed();
