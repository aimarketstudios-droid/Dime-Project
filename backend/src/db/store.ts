import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  fullName: string;
  tier: 'free' | 'premium';
  performanceFeeOpted: boolean;
  stripeCustomerId?: string;
  createdAt: string;
}

export interface BankConnection {
  id: string;
  userId: string;
  institutionId: string;
  institutionName: string;
  status: 'active' | 'requires_reauth' | 'disconnected';
  lastSyncedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  bankConnectionId: string;
  rawDescriptor: string;
  amount: number;
  date: string;
  category: string;
}

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
  createdAt: string;
}

export interface CancellationJob {
  id: string;
  subscriptionId: string;
  userId: string;
  method: 'direct_mandate' | 'legal_notice' | 'headless_portal';
  status: 'pending' | 'in_progress' | 'requires_2fa' | 'completed' | 'failed';
  cancellationProofUrl?: string;
  savingsCalculated: number;
  performanceFeeCharged: number;
  logs: string[];
  otpRequiredFor?: string;
  createdAt: string;
  updatedAt: string;
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

export interface UserFeedback {
  id: string;
  userId: string;
  rating: number; // 1-5
  savedAmountText?: string;
  suggestion: string;
  createdAt: string;
}

class DatabaseStore {
  public users: Map<string, User> = new Map();
  public bankConnections: Map<string, BankConnection> = new Map();
  public transactions: Map<string, Transaction> = new Map();
  public subscriptions: Map<string, Subscription> = new Map();
  public cancellationJobs: Map<string, CancellationJob> = new Map();
  public marketplaceOffers: Map<string, MarketplaceOffer> = new Map();
  public feedbacks: Map<string, UserFeedback> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // 1. Demo Default User (Early Adopter)
    const demoUser: User = {
      id: 'usr_demo_dime_01',
      email: 'earlyadopter@dime.app',
      fullName: 'Alex Morgan',
      tier: 'free',
      performanceFeeOpted: false,
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    // 2. Demo Bank Connection
    const bankConn: BankConnection = {
      id: 'bnk_chase_01',
      userId: demoUser.id,
      institutionId: 'ins_chase',
      institutionName: 'Chase Premier Checking',
      status: 'active',
      lastSyncedAt: new Date().toISOString(),
    };
    this.bankConnections.set(bankConn.id, bankConn);

    // 3. Demo Subscriptions
    const subs: Subscription[] = [
      {
        id: 'sub_netflix_01',
        userId: demoUser.id,
        merchantName: 'Netflix Standard',
        category: 'Streaming',
        billingAmount: 19.99,
        currency: 'USD',
        billingCycle: 'monthly',
        confidenceScore: 0.98,
        status: 'active',
        daysInactive: 42,
        cancellationMethod: 'headless_portal',
        nextBillingDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
      },
      {
        id: 'sub_planet_fitness_02',
        userId: demoUser.id,
        merchantName: 'Planet Fitness Black Card',
        category: 'Fitness',
        billingAmount: 24.99,
        currency: 'USD',
        billingCycle: 'monthly',
        confidenceScore: 0.95,
        status: 'active',
        daysInactive: 78,
        cancellationMethod: 'legal_notice',
        nextBillingDate: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 240 * 86400000).toISOString(),
      },
      {
        id: 'sub_adobe_03',
        userId: demoUser.id,
        merchantName: 'Adobe Creative Cloud',
        category: 'Software',
        billingAmount: 54.99,
        currency: 'USD',
        billingCycle: 'monthly',
        confidenceScore: 0.99,
        status: 'active',
        daysInactive: 65,
        cancellationMethod: 'headless_portal',
        nextBillingDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 365 * 86400000).toISOString(),
      },
      {
        id: 'sub_chegg_04',
        userId: demoUser.id,
        merchantName: 'Chegg Study Pack',
        category: 'Software',
        billingAmount: 19.95,
        currency: 'USD',
        billingCycle: 'monthly',
        confidenceScore: 0.94,
        status: 'active',
        daysInactive: 95,
        cancellationMethod: 'headless_portal',
        nextBillingDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
      },
      {
        id: 'sub_spotify_05',
        userId: demoUser.id,
        merchantName: 'Spotify Premium Family',
        category: 'Streaming',
        billingAmount: 16.99,
        currency: 'USD',
        billingCycle: 'monthly',
        confidenceScore: 0.99,
        status: 'active',
        daysInactive: 2,
        cancellationMethod: 'direct_mandate',
        nextBillingDate: new Date(Date.now() + 22 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 400 * 86400000).toISOString(),
      },
    ];

    subs.forEach((s) => this.subscriptions.set(s.id, s));

    // 4. Demo Marketplace Offers
    const offers: MarketplaceOffer[] = [
      {
        id: 'offer_broadband_01',
        category: 'Broadband',
        currentProvider: 'Xfinity Comcast (100 Mbps)',
        suggestedProvider: 'EarthLink HyperFiber (1 Gbps)',
        currentEstimatedMonthly: 85.0,
        suggestedMonthly: 55.0,
        annualSavings: 360.0,
        affiliateBounty: 120.0,
        actionUrl: 'https://partners.dime.app/switch/broadband?user=' + demoUser.id,
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
        actionUrl: 'https://partners.dime.app/switch/insurance?user=' + demoUser.id,
        highlight: 'Same Coverage + $0 Glass Deductible',
      },
      {
        id: 'offer_cellular_03',
        category: 'Cellular',
        currentProvider: 'Verizon Unlimited Postpaid',
        suggestedProvider: 'Mint Mobile Unlimited (T-Mobile 5G)',
        currentEstimatedMonthly: 80.0,
        suggestedMonthly: 30.0,
        annualSavings: 600.0,
        affiliateBounty: 75.0,
        actionUrl: 'https://partners.dime.app/switch/cellular?user=' + demoUser.id,
        highlight: 'Keep Your Phone & Number + Free 5G hotspot',
      },
    ];

    offers.forEach((o) => this.marketplaceOffers.set(o.id, o));
  }
}

export const db = new DatabaseStore();
