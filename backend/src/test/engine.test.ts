import assert from 'node:assert';
import test from 'node:test';
import { SubscriptionDetector, RawBankTx } from '../services/subscriptionDetector';
import { KillSwitchService } from '../services/killSwitchService';
import { db } from '../db/store';

test('SubscriptionDetector: Accurately detects monthly subscriptions with irregular dates', () => {
  const transactions: RawBankTx[] = [
    { id: 'tx1', amount: 19.99, date: '2026-06-02', rawDescriptor: 'NETFLIX.COM 800-555-0199 CA' },
    { id: 'tx2', amount: 19.99, date: '2026-07-02', rawDescriptor: 'NETFLIX.COM 800-555-0199 CA' },
    { id: 'tx3', amount: 19.99, date: '2026-08-01', rawDescriptor: 'NETFLIX.COM 800-555-0199 CA' },
    { id: 'tx4', amount: 19.99, date: '2026-08-31', rawDescriptor: 'NETFLIX.COM 800-555-0199 CA' },
  ];

  const results = SubscriptionDetector.analyzeTransactions(transactions);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].merchantName, 'Netflix');
  assert.strictEqual(results[0].cadence, 'monthly');
  assert.strictEqual(results[0].billingAmount, 19.99);
  assert.ok(results[0].confidenceScore >= 0.85);
});

test('SubscriptionDetector: Rejects random one-off transactions (Uber, Starbucks)', () => {
  const randomTransactions: RawBankTx[] = [
    { id: 'tx1', amount: 14.50, date: '2026-08-02', rawDescriptor: 'STARBUCKS STORE #12403 SEATTLE WA' },
    { id: 'tx2', amount: 8.25, date: '2026-08-05', rawDescriptor: 'STARBUCKS STORE #12403 SEATTLE WA' },
    { id: 'tx3', amount: 22.10, date: '2026-08-20', rawDescriptor: 'UBER *TRIP 98412 SAN FRANCISCO CA' },
    { id: 'tx4', amount: 31.00, date: '2026-08-28', rawDescriptor: 'UBER *TRIP 11204 SAN FRANCISCO CA' },
  ];

  const results = SubscriptionDetector.analyzeTransactions(randomTransactions);
  assert.strictEqual(results.length, 0, 'One-off transactions should not be flagged as recurring subscriptions');
});

test('KillSwitchService: Executes 100% FREE cancellation without payment methods or fees', async () => {
  const sub = db.subscriptions.get('sub_netflix_01')!;
  assert.ok(sub);

  const job = await KillSwitchService.executeKill(sub.id, 'usr_demo_dime_01');

  // Verify $0.00 fee in free community beta mode
  assert.strictEqual(job.performanceFeeCharged, 0.00);
  assert.strictEqual(job.savingsCalculated, 19.99);

  // For headless_portal, status enters requires_2fa
  assert.strictEqual(job.status, 'requires_2fa');
  assert.ok(job.otpRequiredFor?.includes('Netflix'));

  // Submit 2FA and verify completion
  const completedJob = await KillSwitchService.submit2FA(job.id, '482910');
  assert.strictEqual(completedJob.status, 'completed');
  assert.strictEqual(sub.status, 'cancelled');
  assert.ok(completedJob.cancellationProofUrl);
});
