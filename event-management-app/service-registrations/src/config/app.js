import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import registrationRoutes from '../routes/registration.routes.js';
import { errorHandler, notFound } from '../middlewares/error.middleware.js';
import { env } from './env.js';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(cors({ origin: env.corsOrigin.split(',').map((o) => o.trim()), credentials: true }));
  app.use(helmet());
  app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
  app.get('/api/v1/health', (req, res) =>
    res.json({ success: true, message: 'Registrations service healthy' })
  );
  app.use('/api/v1', registrationRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
