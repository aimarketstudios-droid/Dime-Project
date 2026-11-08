import { Router, Request, Response } from 'express';
import { db } from '../db/store';

const router = Router();

// GET /api/admin/metrics - High-level metrics for admin dashboard
router.get('/metrics', (_req: Request, res: Response) => {
  const subs = Array.from(db.subscriptions.values());
  const jobs = Array.from(db.cancellationJobs.values());
  const feedbacks = Array.from(db.feedbacks.values());

  const totalBleed = subs.reduce((acc, s) => acc + s.billingAmount, 0);
  const deadSubs = subs.filter((s) => s.daysInactive >= 30);
  const totalDeadBleed = deadSubs.reduce((acc, s) => acc + s.billingAmount, 0);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return res.json({
    totalUsers: db.users.size,
    totalSubscriptions: subs.length,
    deadSubscriptionsCount: deadSubs.length,
    totalMonthlyBleed: Number(totalBleed.toFixed(2)),
    potentialAnnualSavings: Number((totalDeadBleed * 12).toFixed(2)),
    totalCancellationsExecuted: jobs.filter((j) => j.status === 'completed').length,
    averageRating: avgRating,
    feedbackCount: feedbacks.length,
  });
});

// GET /admin - Interactive Web Portal for Feedback & Operations
router.get('/', (_req: Request, res: Response) => {
  const subs = Array.from(db.subscriptions.values());
  const jobs = Array.from(db.cancellationJobs.values());
  const feedbacks = Array.from(db.feedbacks.values()).reverse();

  const totalBleed = subs.reduce((acc, s) => acc + s.billingAmount, 0);
  const deadCount = subs.filter((s) => s.daysInactive >= 30).length;
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dime — Admin & Community Feedback Portal</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0D0D0D; color: #E4E4E7; padding: 32px 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; border-bottom: 1px solid #27272A; padding-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand h1 { color: #00FFA3; font-size: 24px; letter-spacing: 2px; }
    .badge { background: rgba(0, 255, 163, 0.15); color: #00FFA3; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; border: 1px solid rgba(0, 255, 163, 0.3); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .card { background: #18181B; border: 1px solid #27272A; border-radius: 16px; padding: 20px; }
    .card h3 { color: #71717A; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .card .val { font-size: 28px; font-weight: 800; color: #FFFFFF; }
    .card .highlight { color: #00FFA3; }
    .card .danger { color: #EF4444; }
    .section-title { font-size: 18px; font-weight: 800; margin-bottom: 16px; color: #FFFFFF; }
    .table-container { background: #18181B; border: 1px solid #27272A; border-radius: 16px; overflow: hidden; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #202024; color: #A1A1AA; font-weight: 700; padding: 14px 16px; border-bottom: 1px solid #27272A; }
    td { padding: 14px 16px; border-bottom: 1px solid #27272A; color: #D4D4D8; }
    tr:last-child td { border-bottom: none; }
    .stars { color: #FACC15; font-size: 14px; letter-spacing: 2px; }
    .status-pill { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; }
    .status-completed { background: rgba(0, 255, 163, 0.15); color: #00FFA3; }
    .status-2fa { background: rgba(234, 179, 8, 0.2); color: #FACC15; }
    .status-active { background: #27272A; color: #A1A1AA; }
    .empty-state { padding: 32px; text-align: center; color: #71717A; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>💎 DIME</h1>
      <span class="badge">FREE BETA ADMIN</span>
    </div>
    <div>
      <span style="color: #71717A; font-size: 13px;">Live Feedback & Operations Portal</span>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h3>Identified Monthly Bleed</h3>
      <div class="val danger">$${totalBleed.toFixed(2)}<span style="font-size: 14px; color: #71717A;">/mo</span></div>
    </div>
    <div class="card">
      <h3>Potential Annual Savings</h3>
      <div class="val highlight">+$${(totalBleed * 12).toFixed(2)}<span style="font-size: 14px; color: #71717A;">/yr</span></div>
    </div>
    <div class="card">
      <h3>Dead Subscriptions (30d+)</h3>
      <div class="val">${deadCount} <span style="font-size: 14px; color: #71717A;">Unused</span></div>
    </div>
    <div class="card">
      <h3>Community Beta Rating</h3>
      <div class="val highlight">${avgRating} ★ <span style="font-size: 14px; color: #71717A;">(${feedbacks.length} reviews)</span></div>
    </div>
  </div>

  <h2 class="section-title">💡 User Suggestions & Community Feedback</h2>
  <div class="table-container">
    ${
      feedbacks.length === 0
        ? '<div class="empty-state">No feedback submitted yet. Users can submit ideas via the mobile app!</div>'
        : `<table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Rating</th>
            <th>User Suggestion / Feature Request</th>
          </tr>
        </thead>
        <tbody>
          ${feedbacks
            .map(
              (f) => `<tr>
            <td style="color: #71717A; white-space: nowrap;">${new Date(f.createdAt).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
            <td><span class="stars">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</span></td>
            <td style="color: #FFFFFF; font-weight: 500;">${f.suggestion}</td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>`
    }
  </div>

  <h2 class="section-title">⚡ Kill Switch Execution Queue</h2>
  <div class="table-container">
    ${
      jobs.length === 0
        ? '<div class="empty-state">No cancellation jobs triggered yet.</div>'
        : `<table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Merchant</th>
            <th>Method</th>
            <th>Status</th>
            <th>Annual Saved</th>
            <th>Logs Preview</th>
          </tr>
        </thead>
        <tbody>
          ${jobs
            .map((j) => {
              const sub = db.subscriptions.get(j.subscriptionId);
              const statusClass =
                j.status === 'completed'
                  ? 'status-completed'
                  : j.status === 'requires_2fa'
                  ? 'status-2fa'
                  : 'status-active';
              return `<tr>
              <td style="font-family: monospace; color: #71717A;">${j.id}</td>
              <td style="font-weight: 700; color: #FFF;">${sub ? sub.merchantName : 'Subscription'}</td>
              <td>${j.method}</td>
              <td><span class="status-pill ${statusClass}">${j.status.toUpperCase()}</span></td>
              <td style="color: #00FFA3; font-weight: 800;">+$${(j.savingsCalculated * 12).toFixed(2)}/yr</td>
              <td style="font-size: 11px; color: #71717A; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${j.logs[j.logs.length - 1] || ''}</td>
            </tr>`;
            })
            .join('')}
        </tbody>
      </table>`
    }
  </div>
</body>
</html>`;

  return res.send(html);
});

export default router;

