import { Router, Request, Response } from 'express';
import { db } from '../db/store';

const router = Router();

// POST /api/billing/create-performance-intent - Stripe PaymentIntent for the 20% cut
router.post('/create-performance-intent', (req: Request, res: Response) => {
  const { subscriptionId } = req.body;
  const sub = db.subscriptions.get(subscriptionId);

  if (!sub) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  const feeAmountInCents = Math.round(sub.billingAmount * 0.2 * 100);

  return res.json({
    clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
    amountInCents: feeAmountInCents,
    currency: 'USD',
    merchant: sub.merchantName,
    savingsExplanation: `You save $${(sub.billingAmount * 12).toFixed(2)}/yr. Dime takes a 1-time fee of $${(sub.billingAmount * 0.2).toFixed(2)}.`,
  });
});

// POST /api/billing/revenuecat-webhook - In-App Purchase event listener
router.post('/revenuecat-webhook', (req: Request, res: Response) => {
  const event = req.body?.event;

  if (event && event.type === 'INITIAL_PURCHASE') {
    const userId = event.app_user_id || 'usr_demo_dime_01';
    const user = db.users.get(userId);
    if (user) {
      user.tier = 'premium';
    }
  }

  return res.json({ received: true });
});

export default router;
