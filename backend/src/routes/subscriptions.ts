import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { KillSwitchService } from '../services/killSwitchService';

const router = Router();

// GET /api/subscriptions - List subscriptions and summary bleed metrics
router.get('/', (req: Request, res: Response) => {
  const allSubs = Array.from(db.subscriptions.values());
  
  const totalMonthlyBleed = allSubs
    .filter((s) => s.status === 'active' || s.status === 'cancelling')
    .reduce((acc, s) => acc + s.billingAmount, 0);

  const deadSubscriptions = allSubs.filter(
    (s) => s.status === 'active' && s.daysInactive >= 30
  );

  const totalDeadBleed = deadSubscriptions.reduce((acc, s) => acc + s.billingAmount, 0);

  return res.json({
    metrics: {
      totalMonthlyBleed: Number(totalMonthlyBleed.toFixed(2)),
      projectedAnnualBleed: Number((totalMonthlyBleed * 12).toFixed(2)),
      deadSubscriptionsCount: deadSubscriptions.length,
      potentialAnnualSavings: Number((totalDeadBleed * 12).toFixed(2)),
    },
    subscriptions: allSubs,
  });
});

// POST /api/subscriptions - Manually add a subscription
router.post('/', (req: Request, res: Response) => {
  const { merchantName, category, billingAmount, billingCycle, daysInactive } = req.body;

  if (!merchantName || !billingAmount) {
    return res.status(400).json({ error: 'Merchant name and billing amount are required' });
  }

  const newSub = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId: 'usr_demo_dime_01',
    merchantName: String(merchantName).trim(),
    category: (category || 'Lifestyle') as any,
    billingAmount: Number(billingAmount),
    currency: 'USD',
    billingCycle: (billingCycle || 'monthly') as any,
    confidenceScore: 1.0,
    status: 'active' as const,
    daysInactive: Number(daysInactive) || 0,
    cancellationMethod: 'headless_portal' as const,
    nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  db.subscriptions.set(newSub.id, newSub);

  return res.status(201).json({
    success: true,
    message: 'Subscription added successfully',
    subscription: newSub,
  });
});

// POST /api/subscriptions/:id/kill - Trigger the Kill Switch (100% Free for Beta Users)
router.post('/:id/kill', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userSignature } = req.body;
  const user = db.users.get('usr_demo_dime_01');

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const job = await KillSwitchService.executeKill(id, user.id, {
      userSignature,
    });
    return res.json({
      success: true,
      freeBeta: true,
      message: '100% Free automated cancellation initiated for early adopter.',
      job,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/subscriptions/jobs/:jobId - Track cancellation job progress
router.get('/jobs/:jobId', (req: Request, res: Response) => {
  const job = db.cancellationJobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  return res.json({ job });
});

// POST /api/subscriptions/jobs/:jobId/submit-2fa - Submit OTP code from user's phone
router.post('/jobs/:jobId/submit-2fa', async (req: Request, res: Response) => {
  const { otpCode } = req.body;
  if (!otpCode) {
    return res.status(400).json({ error: 'OTP code is required' });
  }

  try {
    const updatedJob = await KillSwitchService.submit2FA(req.params.jobId, otpCode);
    return res.json({ success: true, job: updatedJob });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
