import { Router, Request, Response } from 'express';
import { db, UserFeedback } from '../db/store';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/feedback - Collect user feedback and product suggestions
router.post('/', (req: Request, res: Response) => {
  const { rating, suggestion, savedAmountText } = req.body;

  if (!suggestion || typeof suggestion !== 'string') {
    return res.status(400).json({ error: 'Suggestion text is required' });
  }

  const feedback: UserFeedback = {
    id: `fb_${uuidv4().substring(0, 8)}`,
    userId: 'usr_demo_dime_01',
    rating: Number(rating) || 5,
    savedAmountText: savedAmountText || '',
    suggestion: suggestion.trim(),
    createdAt: new Date().toISOString(),
  };

  db.feedbacks.set(feedback.id, feedback);

  console.log(`[USER FEEDBACK RECEIVED] Rating: ${feedback.rating} | "${feedback.suggestion}"`);

  return res.json({
    success: true,
    message: 'Thank you for helping us shape Dime! Your feedback has been recorded.',
    feedback,
  });
});

// GET /api/feedback - List submitted user suggestions
router.get('/', (_req: Request, res: Response) => {
  const allFeedback = Array.from(db.feedbacks.values());
  return res.json({
    count: allFeedback.length,
    feedbacks: allFeedback,
  });
});

export default router;

