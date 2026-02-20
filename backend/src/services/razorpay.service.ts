import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export class RazorpayService {
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
