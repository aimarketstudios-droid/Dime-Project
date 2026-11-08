# 💎 Dime — Automated Subscription Killer (100% Free Community Beta)

> **Zero cost. Unlimited cancellations.** We are offering Dime 100% free for early adopters to demonstrate instant financial savings and gather user suggestions for future development.

---

## 🚀 What Was Updated (100% Free Mode)

1. **All Paywalls & Fees Removed**:
   * **$0 Upfront**: No Apple/Google in-app purchase subscriptions ($4.99/mo removed).
   * **$0 Performance Fee**: No 20% cut taken from savings.
   * **No Credit Card Required**: Users can connect their accounts and kill unwanted subscriptions completely free.
2. **Community Feedback Engine**:
   * In-app **"💡 Feedback"** button on the top bar and dashboard.
   * Direct API endpoint (`POST /api/feedback`) to collect user ratings (1–5 stars), saved amounts, and product feature suggestions.
3. **1-Tap Free Kill Switch**:
   * Users simply tap **"⚡ KILL"**, confirm in the modal, and Dime automatically dispatches the cancellation via legal notice or automated portal bot.

---

## 📱 Mobile Screens (iOS & Android)

* **Dashboard**: Displays Monthly Bleed ($136.91/mo $\rightarrow$ $1,642.92/yr), Dead Subscriptions alert banner, and the **Community Beta Free Banner**.
* **Kill List**: Filterable list of all subscriptions (Active, Dead Weight, Cancelled) with 1-tap free kill action.
* **Switch & Save Marketplace**: Optional free utility comparison (Broadband, Insurance, Cellular) to slash bills users want to keep.
* **Feedback Modal**: Direct in-app dialog for users to submit ideas, bug reports, and suggestions.

---

## 🛠 Local Setup & Running

### 1. Start the Backend API (Free Beta Mode)
```bash
cd backend
pnpm install
pnpm run build
pnpm start
```
The server will run on port `4000`.

### 2. Run Tests
```bash
cd backend
pnpm test
```

### 3. Start the Mobile App (iOS / Android)
```bash
cd mobile
npm install
npx expo start
```
* Press **`i`** to launch in the iOS Simulator.
* Press **`a`** to launch in the Android Emulator.
* Scan the QR code with **Expo Go** on a real phone.
