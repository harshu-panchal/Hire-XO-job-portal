import { Response, Request } from 'express';
import mongoose from 'mongoose';
import { RazorpayService } from '../services/razorpay.service';
import User from '../models/user.model';
import SubscriptionPlan from '../models/subscription-plan.model';
import Transaction from '../models/transaction.model';
import CertificateRequest from '../models/certificate-request.model';
import InterviewTier from '../models/interview-tier.model';
import { notifyAdmins } from '../utils/notifyAdmins';
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
     * Initialize a Razorpay subscription for Interview Verification Tier
     * POST /api/payments/interview-tier/subscribe
     */
    public subscribeInterviewTier = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { tierId } = req.body as { tierId?: string };

            if (!userId || !tierId) {
                res.status(400).json({ message: 'User ID and Tier ID are required' });
                return;
            }

            const user = await User.findById(userId);
            const tier = await InterviewTier.findById(tierId);

            if (!user || !tier) {
                res.status(404).json({ message: 'User or Interview Tier not found' });
                return;
            }

            if (!tier.isActive || tier.price <= 0) {
                res.status(400).json({ message: 'Invalid or free interview tier for Razorpay subscription' });
                return;
            }

            if (!this.razorpayService.isConfigured()) {
                res.status(500).json({ message: 'Razorpay is not configured on server' });
                return;
            }

            let razorpayPlanId = tier.razorpayPlanId;
            if (!razorpayPlanId) {
                const createdPlan = await this.razorpayService.createPlan({
                    name: tier.name,
                    amount: tier.price,
                    durationDays: tier.durationDays,
                    description: tier.description,
                    currency: 'INR'
                });

                tier.razorpayPlanId = createdPlan.id;
                await tier.save();
                razorpayPlanId = createdPlan.id;
            }

            if (!razorpayPlanId) {
                res.status(400).json({ message: 'Unable to resolve Razorpay plan ID for interview tier' });
                return;
            }

            // For interview tiers, a single billing cycle is enough
            const subscription = await this.razorpayService.createSubscription(razorpayPlanId, 1);

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
                            await this.ensureCertificateRequestForRazorpaySubscription(payload.subscription.entity);
                    // Record transaction so admin panel shows who purchased which plan
                    if (event === 'subscription.charged' && payload.payment?.entity) {
                        await this.recordSubscriptionPayment(payload);
                    } else if (event === 'subscription.activated') {
                        await this.recordSubscriptionPaymentFromActivation(payload.subscription.entity);
                    }
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

    /**
     * Immediate endpoint that creates a pending certificate request for the
     * currently authenticated user after a successful Razorpay payment.
     *
     * POST /api/payments/certificate-request
     * Body: { planId: string }
     */
    public createCertificateRequestImmediate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { planId } = req.body as { planId?: string };

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            if (!planId) {
                res.status(400).json({ success: false, message: 'planId is required' });
                return;
            }

            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }

            const plan = await SubscriptionPlan.findById(planId).select('_id name price certificateEligible isActive');
            if (!plan || !plan.isActive) {
                res.status(404).json({ success: false, message: 'Subscription plan not found or inactive' });
                return;
            }

            // Verify that this plan is certificate-eligible
            const isCertificateEligible =
                typeof (plan as any).certificateEligible === 'boolean'
                    ? (plan as any).certificateEligible
                    : (plan.price > 0);

            if (!isCertificateEligible) {
                res.status(400).json({ success: false, message: 'This plan is not eligible for certificates' });
                return;
            }

            // Try to reuse existing request if one already exists for this user/plan or Razorpay subscription
            const existingRequest = await CertificateRequest.findOne({
                userId: user._id,
                planId: plan._id,
                status: 'pending'
            });

            if (existingRequest) {
                res.status(200).json({
                    success: true,
                    data: existingRequest,
                    message: 'Existing certificate request already created for this subscription'
                });
                return;
            }

            const subscriptionId = new mongoose.Types.ObjectId();

            const certificateRequest = await CertificateRequest.create({
                userId: user._id,
                subscriptionId,
                planId: plan._id,
                role: user.role,
                status: 'pending',
                requestedAt: new Date(),
                razorpaySubscriptionId: user.razorpaySubscriptionId || undefined
            });

            await notifyAdmins(
                'New Certificate Request',
                `${user.name} (${user.email}) purchased ${plan.name}. Issue certificate from pending requests.`,
                'info',
                String(certificateRequest._id),
                'certificate_request'
            );

            res.status(201).json({
                success: true,
                message: 'Certificate request created successfully',
                data: certificateRequest
            });
        } catch (error: any) {
            console.error('createCertificateRequestImmediate failed:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create certificate request'
            });
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

    /**
     * Create a pending certificate request when a paid subscription is activated/charged via Razorpay,
     * so the admin Certificates page shows the request. Idempotent per Razorpay subscription id.
     */
    private async ensureCertificateRequestForRazorpaySubscription(entity: any): Promise<void> {
        if (!entity?.id || !entity?.plan_id) return;

        const plan = await SubscriptionPlan.findOne({ razorpayPlanId: entity.plan_id })
            .select('_id name price certificateEligible isActive').lean();
        if (!plan || !plan.isActive) return;

        const isCertificateEligible =
            typeof plan.certificateEligible === 'boolean'
                ? plan.certificateEligible
                : (plan.price > 0);
        if (!isCertificateEligible) return;

        const user = await User.findOne({ razorpaySubscriptionId: entity.id })
            .select('_id name email role').lean();
        if (!user) return;

        try {
            const existingByRzp = await CertificateRequest.findOne({ razorpaySubscriptionId: entity.id });
            if (existingByRzp) return;

            const existingByUserPlan = await CertificateRequest.findOne({
                userId: user._id,
                planId: plan._id,
                status: 'pending'
            });
            if (existingByUserPlan) return;

            const subscriptionId = new mongoose.Types.ObjectId();

            const certificateRequest = await CertificateRequest.create({
                userId: user._id,
                subscriptionId,
                planId: plan._id,
                role: user.role,
                status: 'pending',
                requestedAt: new Date(),
                razorpaySubscriptionId: entity.id
            });

            await notifyAdmins(
                'New Certificate Request',
                `${user.name} (${user.email}) purchased ${plan.name}. Issue certificate from pending requests.`,
                'info',
                String(certificateRequest._id),
                'certificate_request'
            );
        } catch (error) {
            console.error('Certificate request creation failed (Razorpay webhook):', error);
        }
    }

    /**
     * Create a Transaction when subscription.charged fires (payment entity available).
     * Amount in Razorpay payment entity is in paise for INR.
     */
    private async recordSubscriptionPayment(payload: any): Promise<void> {
        const subscriptionEntity = payload.subscription?.entity;
        const paymentEntity = payload.payment?.entity;
        if (!subscriptionEntity?.id || !paymentEntity) return;

        const user = await User.findOne({ razorpaySubscriptionId: subscriptionEntity.id }).select('_id').lean();
        if (!user) return;

        const plan = await SubscriptionPlan.findOne({ razorpayPlanId: subscriptionEntity.plan_id })
            .select('name durationDays').lean();
        const planName = plan?.name || 'Subscription plan';
        const durationDays = plan?.durationDays ?? 0;

        // Razorpay amount is in paise for INR
        const amountPaise = paymentEntity.amount ?? 0;
        const amountRupees = amountPaise / 100;

        await Transaction.create({
            userId: user._id,
            type: 'deduction',
            amount: amountRupees,
            description: `Purchase: ${planName} (${durationDays} days) [Razorpay]`,
            status: 'completed'
        });
    }

    /**
     * Create a Transaction when subscription.activated fires (no payment entity).
     * Uses plan price from DB. Skips if a Razorpay transaction was already recorded recently (e.g. by subscription.charged).
     */
    private async recordSubscriptionPaymentFromActivation(subscriptionEntity: any): Promise<void> {
        if (!subscriptionEntity?.id) return;

        const user = await User.findOne({ razorpaySubscriptionId: subscriptionEntity.id }).select('_id').lean();
        if (!user) return;

        const recent = await Transaction.findOne({
            userId: user._id,
            description: /\[Razorpay\]/,
            createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
        });
        if (recent) return;

        const plan = await SubscriptionPlan.findOne({ razorpayPlanId: subscriptionEntity.plan_id })
            .select('name durationDays price').lean();
        if (!plan) return;

        await Transaction.create({
            userId: user._id,
            type: 'deduction',
            amount: plan.price ?? 0,
            description: `Purchase: ${plan.name} (${plan.durationDays} days) [Razorpay]`,
            status: 'completed'
        });
    }
}
