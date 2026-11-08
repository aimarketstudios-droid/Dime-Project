import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// GET /download - Public Mobile App Download Landing Page
router.get('/', (_req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Dime — Automated Subscription Killer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0D0D0D; color: #E4E4E7; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; text-align: center; }
    .container { max-width: 520px; width: 100%; }
    .brand { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; }
    .brand h1 { color: #00FFA3; font-size: 32px; font-weight: 900; letter-spacing: 3px; }
    .tagline { font-size: 18px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px; }
    .subtext { font-size: 14px; color: #A1A1AA; line-height: 20px; margin-bottom: 32px; }
    .beta-badge { display: inline-block; background: rgba(0, 255, 163, 0.15); color: #00FFA3; padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; border: 1px solid rgba(0, 255, 163, 0.3); margin-bottom: 20px; }
    .download-grid { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
    .card { background: #18181B; border: 1px solid #27272A; border-radius: 20px; padding: 24px; text-align: left; transition: transform 0.2s, border-color 0.2s; }
    .card:hover { border-color: #00FFA3; transform: translateY(-2px); }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .platform-title { font-size: 18px; font-weight: 800; color: #FFFFFF; display: flex; align-items: center; gap: 8px; }
    .card-desc { font-size: 13px; color: #A1A1AA; line-height: 18px; margin-bottom: 18px; }
    .btn { display: block; width: 100%; text-align: center; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 800; text-decoration: none; transition: opacity 0.2s; }
    .btn-android { background-color: #00FFA3; color: #000000; }
    .btn-ios { background-color: #27272A; color: #FFFFFF; border: 1px solid #3F3F46; }
    .btn:hover { opacity: 0.9; }
    .instructions { font-size: 12px; color: #71717A; line-height: 18px; margin-top: 12px; }
    .footer { margin-top: 24px; font-size: 12px; color: #52525B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">
      <span>💎</span>
      <h1>DIME</h1>
    </div>
    <div class="beta-badge">100% FREE EARLY ACCESS BETA</div>
    <div class="tagline">Kill Dead-Weight Subscriptions with 1 Tap</div>
    <div class="subtext">Direct download without App Store or Play Store approval. Install and start saving money in 60 seconds.</div>

    <div class="download-grid">
      <!-- Android Card -->
      <div class="card">
        <div class="card-header">
          <div class="platform-title">🤖 Android (.APK)</div>
          <span style="color: #00FFA3; font-size: 12px; font-weight: 700;">Direct Install</span>
        </div>
        <div class="card-desc">Download the standalone APK directly to your phone. No Google Play Store account required.</div>
        <a href="/download/dime.apk" class="btn btn-android">Download Dime APK for Android</a>
        <div class="instructions">💡 <i>Tip: If prompted, tap "Settings" and enable "Install from this source".</i></div>
      </div>

      <!-- iOS Card -->
      <div class="card">
        <div class="card-header">
          <div class="platform-title">🍎 iPhone (iOS)</div>
          <span style="color: #A1A1AA; font-size: 12px; font-weight: 700;">Instant Launch</span>
        </div>
        <div class="card-desc">Open the native Dime app directly on iPhone via the Expo Instant runner with zero App Store friction.</div>
        <a href="https://expo.dev/@aimarketstudios/dime-app" class="btn btn-ios">Open Instant App on iPhone</a>
        <div class="instructions">💡 <i>Tip: Tap the link or scan using the free <b>Expo Go</b> app on your iPhone.</i></div>
      </div>
    </div>

    <div class="footer">
      🔒 Bank-grade 256-bit encryption • Zero subscription fees • Community Beta
    </div>
  </div>
</body>
</html>`;

  return res.send(html);
});

// GET /download/dime.apk - Direct binary download
router.get('/dime.apk', (_req: Request, res: Response) => {
  const apkPath = path.join(__dirname, '..', '..', 'public', 'dime.apk');
  if (fs.existsSync(apkPath)) {
    return res.download(apkPath, 'Dime-App-v1.0.0.apk');
  }

  // Redirect to GitHub release APK download
  return res.redirect('https://github.com/aimarketstudios-droid/Dime-Project/releases/download/v1.0.0/Dime-v1.0.0.apk');
});

export default router;

