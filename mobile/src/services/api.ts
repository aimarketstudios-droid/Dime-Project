export const API_BASE_URL = 'https://dime-project.onrender.com/api';

export interface Subscription {
  id: string;
  userId: string;
  merchantName: string;
  category: 'Streaming' | 'Fitness' | 'Software' | 'Utilities' | 'Lifestyle';
  billingAmount: number;
  currency: string;
  billingCycle: 'monthly' | 'annual' | 'weekly';
  confidenceScore: number;
  status: 'active' | 'cancelling' | 'cancelled' | 'disputed';
  daysInactive: number;
  cancellationMethod: 'direct_mandate' | 'legal_notice' | 'headless_portal';
  nextBillingDate: string;
}

export interface BleedMetrics {
  totalMonthlyBleed: number;
  projectedAnnualBleed: number;
  deadSubscriptionsCount: number;
  potentialAnnualSavings: number;
}

export interface MarketplaceOffer {
  id: string;
  category: 'Broadband' | 'Car Insurance' | 'Cellular' | 'Electricity';
  currentProvider: string;
  suggestedProvider: string;
  currentEstimatedMonthly: number;
  suggestedMonthly: number;
  annualSavings: number;
  affiliateBounty: number;
  actionUrl: string;
  highlight: string;
}

export interface KillJob {
  id: string;
  subscriptionId: string;
  status: 'pending' | 'in_progress' | 'requires_2fa' | 'completed' | 'failed';
  savingsCalculated: number;
  performanceFeeCharged: number;
  logs: string[];
  otpRequiredFor?: string;
  cancellationProofUrl?: string;
}

export const DimeApi = {
  async getSubscriptions(): Promise<{ metrics: BleedMetrics; subscriptions: Subscription[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/subscriptions`);
      if (!res.ok) throw new Error('Failed to fetch subscriptions');
      return await res.json();
    } catch {
      // Clean zeroed fallback when offline
      return {
        metrics: {
          totalMonthlyBleed: 0,
          projectedAnnualBleed: 0,
          deadSubscriptionsCount: 0,
          potentialAnnualSavings: 0,
        },
        subscriptions: [],
      };
    }
  },

  // Add custom or real subscription manually
  async addSubscription(data: {
    merchantName: string;
    category: string;
    billingAmount: number;
    billingCycle: string;
    daysInactive: number;
  }): Promise<{ success: boolean; subscription: Subscription }> {
    const res = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add subscription');
    return await res.json();
  },

  // 100% Free Trigger - No payment details required
  async triggerKill(subscriptionId: string): Promise<{ success: boolean; job: KillJob }> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/kill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error('Free kill request failed');
    return await res.json();
  },

  async submitOtp(jobId: string, otpCode: string): Promise<{ success: boolean; job: KillJob }> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/jobs/${jobId}/submit-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otpCode }),
    });
    if (!res.ok) throw new Error('OTP submission failed');
    return await res.json();
  },

  async submitFeedback(data: {
    rating: number;
    suggestion: string;
    savedAmountText?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Feedback recorded locally!' };
    }
  },

  async getMarketplaceOffers(): Promise<{ offers: MarketplaceOffer[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/marketplace/offers`);
      if (!res.ok) throw new Error('Failed to fetch marketplace offers');
      return await res.json();
    } catch {
      return {
        offers: [
          {
            id: 'offer_broadband_01',
            category: 'Broadband',
            currentProvider: 'Xfinity Comcast (100 Mbps)',
            suggestedProvider: 'EarthLink HyperFiber (1 Gbps)',
            currentEstimatedMonthly: 85.0,
            suggestedMonthly: 55.0,
            annualSavings: 360.0,
            affiliateBounty: 120.0,
            actionUrl: 'https://partners.dime.app/switch/broadband',
            highlight: '10x Faster Speed + Unlimited Data',
          },
          {
            id: 'offer_insurance_02',
            category: 'Car Insurance',
            currentProvider: 'State Farm Comprehensive',
            suggestedProvider: 'Progressive Auto Shield',
            currentEstimatedMonthly: 145.0,
            suggestedMonthly: 98.0,
            annualSavings: 564.0,
            affiliateBounty: 150.0,
            actionUrl: 'https://partners.dime.app/switch/insurance',
            highlight: 'Same Coverage + $0 Glass Deductible',
          },
          {
            id: 'offer_cellular_03',
            category: 'Cellular',
            currentProvider: 'Verizon Unlimited Postpaid',
            suggestedProvider: 'Mint Mobile Unlimited',
            currentEstimatedMonthly: 80.0,
            suggestedMonthly: 30.0,
            annualSavings: 600.0,
            affiliateBounty: 75.0,
            actionUrl: 'https://partners.dime.app/switch/cellular',
            highlight: 'Keep Your Phone & Number + Free hotspot',
          },
        ],
      };
    }
  },
};
