import { Response, Request } from 'express';
import { RazorpayService } from '../services/razorpay.service';
import User from '../models/user.model';
import SubscriptionPlan from '../models/subscription-plan.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export class PaymentController {
    private razorpayService: RazorpayService;

    constructor() {
        this.razorpayService = new RazorpayService();
    }

    /**
     * Initialize a subscription
     * POST /api/payments/subscribe
     */
    public subscribe = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { planId } = req.body;

            if (!userId || !planId) {
                res.status(400).json({ message: 'User ID and Plan ID are required' });
                return;
            }

            const user = await User.findById(userId);
            const plan = await SubscriptionPlan.findById(planId);

            if (!user || !plan) {
                res.status(404).json({ message: 'User or Plan not found' });
                return;
            }

            if (!plan.razorpayPlanId) {
                if (plan.price <= 0) {
                    res.status(400).json({ message: 'Free plans do not require Razorpay subscription' });
                    return;
                }

                if (!this.razorpayService.isConfigured()) {
                    res.status(500).json({ message: 'Razorpay is not configured on server' });
                    return;
                }

                const createdPlan = await this.razorpayService.createPlan({
                    name: plan.name,
                    amount: plan.price,
                    durationDays: plan.durationDays,
                    description: plan.description,
                    currency: 'INR'
                });

                plan.razorpayPlanId = createdPlan.id;
                await plan.save();
            }

            const razorpayPlanId = plan.razorpayPlanId;
            if (!razorpayPlanId) {
                res.status(400).json({ message: 'Unable to resolve Razorpay plan ID' });
                return;
            }

            const subscription = await this.razorpayService.createSubscription(razorpayPlanId);

            // Update user with subscription ID (status remains 'none' until webhook)
            await User.findByIdAndUpdate(userId, {
                razorpaySubscriptionId: subscription.id,
                subscriptionStatus: 'created'
            });

            res.status(200).json({
                success: true,
                subscriptionId: subscription.id,
                razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    /**
     * Webhook handler for Razorpay events
     * POST /api/payments/webhook
     */
    public webhook = async (req: Request, res: Response): Promise<void> => {
        const signature = req.headers['x-razorpay-signature'] as string;
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';

        try {
            const isValid = this.razorpayService.verifyWebhookSignature(
                JSON.stringify(req.body),
                signature,
                secret
            );

            if (!isValid) {
                res.status(400).json({ message: 'Invalid signature' });
                return;
            }

            const event = req.body.event;
            const payload = req.body.payload;

            switch (event) {
                case 'subscription.activated':
                case 'subscription.charged':
                    await this.handleSubscriptionActivation(payload.subscription.entity);
                    break;
                case 'subscription.cancelled':
                case 'subscription.expired':
                    await this.handleSubscriptionDeactivation(payload.subscription.entity);
                    break;
            }

            res.status(200).json({ status: 'ok' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    private async handleSubscriptionActivation(entity: any) {
        const subscriptionId = entity.id;
        const plan = await SubscriptionPlan.findOne({ razorpayPlanId: entity.plan_id }).select('_id').lean();
        const updateData: any = {
            subscriptionStatus: 'active',
            subscriptionExpiry: new Date(entity.current_end * 1000)
        };

        if (plan?._id) {
            updateData.activeSubscriptionId = String(plan._id);
        }

        await User.findOneAndUpdate(
            { razorpaySubscriptionId: subscriptionId },
            updateData
        );
    }

    private async handleSubscriptionDeactivation(entity: any) {
        const subscriptionId = entity.id;
        await User.findOneAndUpdate(
            { razorpaySubscriptionId: subscriptionId },
            {
                subscriptionStatus: entity.status, // cancelled/expired
                activeSubscriptionId: undefined
            }
        );
    }
}
