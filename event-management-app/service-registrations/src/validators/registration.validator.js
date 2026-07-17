import { body, param, query } from 'express-validator';

export const createRegistrationValidator = [
  body('eventId').isMongoId().withMessage('El evento no es valido'),
  body('attendeeName').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('attendeeEmail').isEmail().withMessage('El correo no es valido').normalizeEmail(),
  body('attendeePhone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }),
];

export const idParamValidator = [
  param('id').isMongoId().withMessage('El id no es valido'),
];

export const eventParamValidator = [
  param('id').isMongoId().withMessage('El id del evento no es valido'),
];

export const listRegistrationValidator = [
  query('eventId').optional().isMongoId().withMessage('El evento no es valido'),
];
