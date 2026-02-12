import SubscriptionPlan from '../models/subscription-plan.model';
import PromotionPlan from '../models/promotion-plan.model';

export const seedPlans = async () => {
    try {
        // Seed subscription plans
        const subCount = await SubscriptionPlan.countDocuments();
        if (subCount === 0) {
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

        // Seed promotion plans
        const promoCount = await PromotionPlan.countDocuments();
        if (promoCount === 0) {
            console.log('Seeding promotion plans...');

            await PromotionPlan.create([
                {
                    name: '7 Days',
                    price: 999,
                    duration: 7,
                    estimatedReachMin: 500,
                    estimatedReachMax: 800,
                    priority: 3, // Lower priority
                    features: [
                        'Featured listing for 7 days',
                        'Priority in search results',
                        '3x more visibility',
                        'Highlighted with badge',
                        'Email support'
                    ],
                    isMostPopular: false,
                    isActive: true
                },
                {
                    name: '15 Days',
                    price: 1799,
                    duration: 15,
                    estimatedReachMin: 1200,
                    estimatedReachMax: 1800,
                    priority: 5, // Medium priority
                    features: [
                        'Featured listing for 15 days',
                        'Top of search results',
                        '5x more visibility',
                        'Premium highlight badge',
                        'Priority support',
                        'Analytics dashboard'
                    ],
                    isMostPopular: true,
                    isActive: true
                },
                {
                    name: '30 Days',
                    price: 2999,
                    duration: 30,
                    estimatedReachMin: 2500,
                    estimatedReachMax: 3500,
                    priority: 10, // Highest priority
                    features: [
                        'Featured listing for 30 days',
                        'Guaranteed top position',
                        '10x more visibility',
                        'Premium+ highlight badge',
                        '24/7 Priority support',
                        'Advanced analytics',
                        'Dedicated account manager'
                    ],
                    isMostPopular: false,
                    isActive: true
                }
            ]);

            console.log('Promotion plans seeded successfully');
        }
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
                console.error('Error seeding plans:', error);
            }
        };
