import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3002),
  mongodbUri:
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/event_management_registrations',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  eventsServiceUrl: process.env.EVENTS_SERVICE_URL || 'http://localhost:3001/api/v1',
  httpTimeoutMs: Number(process.env.HTTP_TIMEOUT_MS || 5000),
  jwtSecret: process.env.JWT_SECRET,
  jwtIssuer: process.env.JWT_ISSUER || 'BibliotecaAPI',
  jwtAudience: process.env.JWT_AUDIENCE || 'BibliotecaAPI',
  jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
};
