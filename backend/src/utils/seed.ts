import SubscriptionPlan from '../models/subscription-plan.model';

const plansToSeed = [
    {
        name: 'Pro Employer',
        price: 999,
        durationDays: 180,
        description: 'Supercharge your hiring process with unlimited access to candidates and resumes.',
        features: [
            'Contact Unlimited Candidates',
            'Download Unlimited Resumes',
            'Priority Job Listings',
            'Verified Employer Badge'
        ],
        isActive: true
    },
    {
        name: 'Employee Verification Certificate',
        price: 99,
        durationDays: 180,
        description: 'Verified Employee – Identity & Profile Checked',
        features: [
            'Employee identity verification',
            'Verified badge on employee profile',
            'Builds trust with employers & resource providers',
            'Higher chances of selection'
        ],
        isActive: true
    },
    {
        name: 'Job Loss Cover Certificate',
        price: 99,
        durationDays: 180,
        description: 'Job Loss Support – We Help You Get Re-Hired Faster',
        features: [
            'If employee loses job due to project closure or employer issue',
            'Platform helps employee find a new job opportunity',
            'Priority support from hub team',
            'Reduced waiting time for next job'
        ],
        isActive: true
    },
    {
        name: 'Emergency Replacement Support Certificate',
        price: 199,
        durationDays: 180,
        description: 'Emergency Support – Managed Replacement & Re-Joining Assistance',
        features: [
            'If employee needs to go home due to emergency',
            'Platform coordinates with hub employers',
            'Replacement employee arranged as per employer requirement',
            'Employer project continuity maintained',
            'Employee can re-join later if required'
        ],
        isActive: true
    }
];

export const seedPlans = async () => {
    try {
        console.log('Checking subscription plans...');

        for (const plan of plansToSeed) {
            const existingPlan = await SubscriptionPlan.findOne({ name: plan.name });
            if (!existingPlan) {
                await SubscriptionPlan.create(plan);
                console.log(`Created plan: ${plan.name}`);
            }
        }

        console.log('Subscription plans check completed');
    } catch (error) {
        console.error('Error seeding subscription plans:', error);
    }
};
