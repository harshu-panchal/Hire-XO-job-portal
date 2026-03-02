import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

type RazorpayPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export class RazorpayService {
    public isConfigured(): boolean {
        const keyId = process.env.RAZORPAY_KEY_ID || '';
        const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

        console.log('[RazorpayService.isConfigured] NODE_ENV:', process.env.NODE_ENV);
        console.log('[RazorpayService.isConfigured] RAZORPAY_KEY_ID present:', !!keyId, 'prefix:', keyId.slice(0, 6));
        console.log('[RazorpayService.isConfigured] RAZORPAY_KEY_SECRET present:', !!keySecret);

        if (!keyId || !keySecret) return false;
        if (keyId.includes('placeholder') || keySecret.includes('placeholder')) return false;

        return true;
    }

    private mapDurationToBilling(durationDays: number): { period: RazorpayPeriod; interval: number } {
        if (durationDays % 365 === 0) {
            return { period: 'yearly', interval: Math.max(1, Math.floor(durationDays / 365)) };
        }

        if (durationDays % 30 === 0) {
            return { period: 'monthly', interval: Math.max(1, Math.floor(durationDays / 30)) };
        }

        if (durationDays % 7 === 0) {
            return { period: 'weekly', interval: Math.max(1, Math.floor(durationDays / 7)) };
        }

        return { period: 'daily', interval: Math.max(1, Math.floor(durationDays)) };
    }

    public async createPlan(params: {
        name: string;
        amount: number;
        durationDays: number;
        description?: string;
        currency?: string;
    }) {
        try {
            console.log('[RazorpayService.createPlan] Called with params:', {
                name: params.name,
                amount: params.amount,
                durationDays: params.durationDays,
                currency: params.currency || 'INR'
            });

            const { period, interval } = this.mapDurationToBilling(params.durationDays);
            const planPayload: any = {
                period,
                interval,
                item: {
                    name: params.name,
                    amount: Math.round(params.amount * 100),
                    currency: params.currency || 'INR',
                    description: params.description || params.name
                }
            };

            console.log('[RazorpayService.createPlan] Payload to Razorpay:', {
                period: planPayload.period,
                interval: planPayload.interval,
                item: {
                    name: planPayload.item.name,
                    amount: planPayload.item.amount,
                    currency: planPayload.item.currency
                }
            });

            const plan = await razorpay.plans.create(planPayload);
            console.log('[RazorpayService.createPlan] Plan created. Razorpay plan id:', plan.id);
            return plan;
        } catch (error) {
            console.error('[RazorpayService.createPlan] Razorpay Plan Creation Error:', error);
            console.error('[RazorpayService.createPlan] Environment:', {
                NODE_ENV: process.env.NODE_ENV,
                keyIdPresent: !!process.env.RAZORPAY_KEY_ID,
                keyIdPrefix: (process.env.RAZORPAY_KEY_ID || '').slice(0, 6)
            });
            throw error;
        }
    }

    /**
     * Create a Razorpay subscription
     * @param planId Razorpay Plan ID (from dashboard)
     * @param customerId Razorpay Customer ID (optional)
     * @param totalCount Number of billing cycles
     */
    public async createSubscription(planId: string, totalCount: number = 12) {
        try {
            const subscription = await razorpay.subscriptions.create({
                plan_id: planId,
                total_count: totalCount,
                quantity: 1,
                customer_notify: 1,
                // start_at: Math.floor(Date.now() / 1000) + 3600, // Optional: start in 1 hour
            });
            return subscription;
        } catch (error) {
            console.error('Razorpay Subscription Creation Error:', error);
            throw error;
        }
    }

    /**
     * Get subscription details
     */
    public async getSubscription(subscriptionId: string) {
        try {
            return await razorpay.subscriptions.fetch(subscriptionId);
        } catch (error) {
            console.error('Razorpay Subscription Fetch Error:', error);
            throw error;
        }
    }

    /**
     * Cancel a subscription
     */
    public async cancelSubscription(subscriptionId: string) {
        try {
            return await razorpay.subscriptions.cancel(subscriptionId);
        } catch (error) {
            console.error('Razorpay Subscription Cancel Error:', error);
            throw error;
        }
    }

    /**
     * Verify Razorpay Webhook Signature
     */
    public verifyWebhookSignature(payload: string, signature: string, secret: string) {
        return Razorpay.validateWebhookSignature(payload, signature, secret);
    }
}
