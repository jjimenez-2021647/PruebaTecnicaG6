import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createAuthMiddleware } from '../../../shared/auth/validateAuthToken.js';

export const validateAuthToken = createAuthMiddleware({
  jwt,
  secret: env.jwtSecret,
  issuer: env.jwtIssuer,
  audience: env.jwtAudience,
  algorithm: env.jwtAlgorithm,
});
