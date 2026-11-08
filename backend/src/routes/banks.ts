import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { SubscriptionDetector, RawBankTx } from '../services/subscriptionDetector';

const router = Router();

// POST /api/banks/create-link-token - Generate Plaid Link Token
router.post('/create-link-token', (req: Request, res: Response) => {
  return res.json({
    linkToken: `link-sandbox-${Date.now()}-mock-token`,
    expiration: new Date(Date.now() + 4 * 3600000).toISOString(),
  });
});

// POST /api/banks/exchange-token - Exchange public token after user connects bank
router.post('/exchange-token', (req: Request, res: Response) => {
  const { publicToken, metadata } = req.body;
  const connectionId = `bnk_${Date.now()}`;

  db.bankConnections.set(connectionId, {
    id: connectionId,
    userId: 'usr_demo_dime_01',
    institutionId: metadata?.institution?.id || 'ins_generic',
    institutionName: metadata?.institution?.name || 'Linked Financial Institution',
    status: 'active',
    lastSyncedAt: new Date().toISOString(),
  });

  return res.json({
    success: true,
    connectionId,
    message: 'Bank connection verified and indexed for subscription scanning.',
  });
});

// POST /api/banks/simulate-sync - Test detection engine with fresh transactions
router.post('/simulate-sync', (req: Request, res: Response) => {
  const sampleTransactions: RawBankTx[] = [
    { id: '1', amount: 19.99, date: '2026-08-01', rawDescriptor: 'NETFLIX.COM PAYMENT 800-555-0199 CA' },
    { id: '2', amount: 19.99, date: '2026-09-01', rawDescriptor: 'NETFLIX.COM PAYMENT 800-555-0199 CA' },
    { id: '3', amount: 19.99, date: '2026-10-01', rawDescriptor: 'NETFLIX.COM PAYMENT 800-555-0199 CA' },
    { id: '4', amount: 24.99, date: '2026-08-15', rawDescriptor: 'PLANET FITNESS CLUB #1029 MONTHLY DUES' },
    { id: '5', amount: 24.99, date: '2026-09-15', rawDescriptor: 'PLANET FITNESS CLUB #1029 MONTHLY DUES' },
    { id: '6', amount: 24.99, date: '2026-10-15', rawDescriptor: 'PLANET FITNESS CLUB #1029 MONTHLY DUES' },
    { id: '7', amount: 20.00, date: '2026-08-05', rawDescriptor: 'OPENAI *CHATGPT SUBSCRIPTION' },
    { id: '8', amount: 20.00, date: '2026-09-05', rawDescriptor: 'OPENAI *CHATGPT SUBSCRIPTION' },
  ];

  const detected = SubscriptionDetector.analyzeTransactions(sampleTransactions);

  return res.json({
    scannedCount: sampleTransactions.length,
    detectedSubscriptions: detected,
  });
});

export default router;
