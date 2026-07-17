import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import eventRoutes from '../routes/event.routes.js';
import { errorHandler, notFound } from '../middlewares/error.middleware.js';
import { env } from './env.js';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: env.corsOrigin.split(',').map((origin) => origin.trim()),
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

  app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Events service healthy',
      data: { service: 'service-events', timestamp: new Date().toISOString() },
    });
  });

  app.use('/api/v1/events', eventRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
