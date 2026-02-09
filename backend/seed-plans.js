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
        name: 'Employer Verification',
        price: 99,
        durationDays: 365,
        description: 'Get verified and build trust',
        features: [
            'Get certificate & verified badge',
            'Build trust for employees & resources',
            'Displayed to all users'
        ],
        isActive: true
    },
    {
        name: 'Only Employees',
        price: 499,
        durationDays: 30,
        description: 'Essential hiring tools',
        features: [
            'Post jobs unlimited',
            'Browse employees',
            '3 Free contacts',
            'Resources access' // Will be handled in frontend as crossed out
        ],
        isActive: true
    },
    {
        name: 'Employees + Resources - Unlimited',
        price: 999,
        durationDays: 30,
        description: 'Most Popular Choice',
        features: [
            'All resources unlimited',
            'Employee contacts unlimited',
            'Tender apply unlimited',
            'Investor connect limited'
        ],
        isActive: true
    },
    {
        name: 'Employees + Resources - Premium',
        price: 2499,
        durationDays: 30,
        description: 'Best Value Plan',
        features: [
            'Everything unlimited',
            'Featured badge',
            'Priority support',
            'Direct WhatsApp / Call',
            'Tender & investor priority apply'
        ],
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
