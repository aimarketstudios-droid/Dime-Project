import { Router, Request, Response } from 'express';
import { db } from '../db/store';

const router = Router();

// GET /api/auth/me - Current user profile
router.get('/me', (req: Request, res: Response) => {
  const user = db.users.get('usr_demo_dime_01');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user });
});

// POST /api/auth/upgrade-tier - Upgrade to Premium ($4.99/mo or $39.99/yr)
router.post('/upgrade-tier', (req: Request, res: Response) => {
  const { tier } = req.body;
  const user = db.users.get('usr_demo_dime_01');
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (tier !== 'free' && tier !== 'premium') {
    return res.status(400).json({ error: 'Invalid tier' });
  }

  user.tier = tier;
  return res.json({ success: true, user });
});

// POST /api/auth/toggle-performance-fee - Authorize 20% Performance Cut
router.post('/toggle-performance-fee', (req: Request, res: Response) => {
  const { opted } = req.body;
  const user = db.users.get('usr_demo_dime_01');
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.performanceFeeOpted = Boolean(opted);
  return res.json({ success: true, performanceFeeOpted: user.performanceFeeOpted });
});

export default router;
