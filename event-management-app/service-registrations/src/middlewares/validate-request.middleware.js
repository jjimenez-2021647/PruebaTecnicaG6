import { validationResult } from 'express-validator';
import { AppError } from '../utils/app-error.js';

export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return next(
    new AppError(
      'Errores de validacion',
      400,
      result.array().map((error) => ({ field: error.path, message: error.msg }))
    )
  );
}
