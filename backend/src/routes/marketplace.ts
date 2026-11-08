import { Router, Request, Response } from 'express';
import { MarketplaceService } from '../services/marketplaceService';

const router = Router();

// GET /api/marketplace/offers - List personalized utility & insurance switch offers
router.get('/offers', (req: Request, res: Response) => {
  const offers = MarketplaceService.getOffersForUser('usr_demo_dime_01');
  const totalPotentialSavings = offers.reduce((acc, o) => acc + o.annualSavings, 0);

  return res.json({
    offers,
    summary: {
      offersCount: offers.length,
      totalPotentialAnnualSavings: Number(totalPotentialSavings.toFixed(2)),
    },
  });
});

// POST /api/marketplace/switch - User clicks to switch, generate affiliate redirect
router.post('/switch', (req: Request, res: Response) => {
  const { offerId } = req.body;
  if (!offerId) return res.status(400).json({ error: 'offerId is required' });

  try {
    const result = MarketplaceService.trackSwitchLead(offerId, 'usr_demo_dime_01');
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

export default router;
