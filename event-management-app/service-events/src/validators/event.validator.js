import { body, param } from 'express-validator';
import { EVENT_STATUSES } from '../models/event.model.js';

export const idParamValidator = [
  param('id').isMongoId().withMessage('El id del evento no es valido'),
];

export const createEventValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 120 })
    .withMessage('El nombre no puede exceder 120 caracteres'),
  body('date').isISO8601().withMessage('La fecha debe ser valida'),
  body('place')
    .trim()
    .notEmpty()
    .withMessage('El lugar es obligatorio')
    .isLength({ max: 160 })
    .withMessage('El lugar no puede exceder 160 caracteres'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un entero mayor que cero')
    .toInt(),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 1200 })
    .withMessage('La descripcion no puede exceder 1200 caracteres'),
  body('status')
    .optional()
    .isIn(EVENT_STATUSES)
    .withMessage(`El estado debe ser uno de: ${EVENT_STATUSES.join(', ')}`),
];

export const updateEventValidator = [
  ...idParamValidator,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede ir vacio')
    .isLength({ max: 120 })
    .withMessage('El nombre no puede exceder 120 caracteres'),
  body('date').optional().isISO8601().withMessage('La fecha debe ser valida'),
  body('place')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El lugar no puede ir vacio')
    .isLength({ max: 160 })
    .withMessage('El lugar no puede exceder 160 caracteres'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacidad debe ser un entero mayor que cero')
    .toInt(),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 1200 })
    .withMessage('La descripcion no puede exceder 1200 caracteres'),
  body('status')
    .optional()
    .isIn(EVENT_STATUSES)
    .withMessage(`El estado debe ser uno de: ${EVENT_STATUSES.join(', ')}`),
];
