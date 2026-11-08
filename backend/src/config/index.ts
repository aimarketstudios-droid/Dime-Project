import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dime-production-super-secret-jwt-key-2026',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dime_db',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Plaid API configuration
  plaid: {
    clientId: process.env.PLAID_CLIENT_ID || 'mock_plaid_client_id',
    secret: process.env.PLAID_SECRET || 'mock_plaid_secret',
    env: process.env.PLAID_ENV || 'sandbox',
  },

  // Stripe Billing configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock',
  },

  // RevenueCat In-App Purchases configuration
  revenueCat: {
    apiKey: process.env.REVENUECAT_SECRET_KEY || 'rc_mock_secret_key',
  },

  // CORS origins
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '*').split(','),
};

