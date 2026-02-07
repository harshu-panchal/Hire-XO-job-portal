import SubscriptionPlan from '../models/subscription-plan.model';

export const seedPlans = async () => {
    try {
        const count = await SubscriptionPlan.countDocuments();
        if (count === 0) {
            console.log('Seeding subscription plans...');
            await SubscriptionPlan.create({
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
            });
            console.log('Subscription plans seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding subscription plans:', error);
    }
};
