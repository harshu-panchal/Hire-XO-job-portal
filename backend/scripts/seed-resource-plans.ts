import mongoose from 'mongoose';
import SubscriptionPlan from '../src/models/subscription-plan.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const resourcePlans = [
    {
        name: 'Resources Verification',
        price: 99,
        durationDays: 180,
        description: 'Get verified and build trust with your profile.',
        type: 'resource',
        features: [
            'Verified certificate & badge',
            'Build trust & credibility',
            'Displayed to employees, employers & other users',
            'Certificate valid for 6 months',
            'Verified Resource - Credible & Trusted by Platform Users'
        ],
        isActive: true
    },
    {
        name: 'Tender Plan',
        price: 299,
        durationDays: 30,
        description: 'Access and bid for tenders.',
        type: 'resource',
        features: [
            'Browse & contact Tender resource',
            '5 free contacts included',
            'Additional contact ₹49 / Investor/Tender ₹99',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'Investor Plan',
        price: 299,
        durationDays: 30,
        description: 'Connect with potential investors.',
        type: 'resource',
        features: [
            'Browse & contact Investor resource',
            '5 free contacts included',
            'Additional contact ₹49 / Investor/Tender ₹99',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'Equipment Plan',
        price: 299,
        durationDays: 30,
        description: 'Rent or provide equipment.',
        type: 'resource',
        features: [
            'Browse & contact Equipment resource',
            '5 free contacts included',
            'Additional contact ₹49',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'Machinery Plan',
        price: 299,
        durationDays: 30,
        description: 'Buy or sell industrial machinery.',
        type: 'resource',
        features: [
            'Browse & contact Machinery resource',
            '5 free contacts included',
            'Additional contact ₹49',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'PMC Plan',
        price: 299,
        durationDays: 30,
        description: 'Project Management Consulting services.',
        type: 'resource',
        features: [
            'Browse & contact PMC resource',
            '5 free contacts included',
            'Additional contact ₹49',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'CSM Plan',
        price: 299,
        durationDays: 30,
        description: 'Construction Site Management services.',
        type: 'resource',
        features: [
            'Browse & contact CSM resource',
            '5 free contacts included',
            'Additional contact ₹49',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'Logistics Plan',
        price: 299,
        durationDays: 30,
        description: 'Connect with logistics providers.',
        type: 'resource',
        features: [
            'Browse & contact Logistics resource',
            '5 free contacts included',
            'Additional contact ₹49',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'Vehicles Plan',
        price: 299,
        durationDays: 30,
        description: 'Rent or provide industrial vehicles.',
        type: 'resource',
        features: [
            'Browse & contact Vehicles resource',
            '5 free contacts included',
            'Additional contact ₹49',
            'Employees/Job posting Not included'
        ],
        isActive: true
    },
    {
        name: 'All Resources Plan',
        price: 699,
        durationDays: 30,
        description: 'Full access to all resource categories.',
        type: 'resource',
        features: [
            'Browse & contact all 8 resources',
            '10 free contacts included',
            'Additional contact ₹49 / ₹99 per connect',
            'Employees/Job posting Not included'
        ],
        isActive: true
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/hirexo');
        console.log('Connected to MongoDB');

        for (const plan of resourcePlans) {
            await SubscriptionPlan.findOneAndUpdate(
                { name: plan.name },
                plan,
                { upsert: true, new: true }
            );
        }

        console.log('Resource subscription plans seeded successfully');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding resource plans:', error);
        process.exit(1);
    }
}

seed();
