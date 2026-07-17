import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export function notFound(req, res, next) {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
}

export function errorHandler(error, req, res, next) {
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    errors: error.errors || [],
    stack: env.nodeEnv === 'development' ? error.stack : undefined,
  });
}
