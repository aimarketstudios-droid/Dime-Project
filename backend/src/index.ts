import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';

import authRoutes from './routes/auth';
import bankRoutes from './routes/banks';
import subscriptionRoutes from './routes/subscriptions';
import marketplaceRoutes from './routes/marketplace';
import feedbackRoutes from './routes/feedback';
import adminRoutes from './routes/admin';
import downloadRoutes from './routes/download';

const app: express.Express = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({ origin: config.allowedOrigins }));
app.use(express.json());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Liveness & Readiness probe
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'healthy',
    mode: '100% Free Beta (Community Feedback Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
  });
});

// Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/admin', adminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/download', downloadRoutes);

// 404 Catch-all
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'production' ? undefined : err.message,
  });
});

// Start Server
const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(` Dime Engine running in 100% FREE BETA MODE on port ${config.port}`);
  console.log(` Community Feedback Endpoint: http://localhost:${config.port}/api/feedback`);
  console.log(` Healthcheck: http://localhost:${config.port}/health`);
  console.log(`=======================================================`);
});

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down Dime server...`);
  server.close(() => {
    console.log('Server terminated cleanly.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
