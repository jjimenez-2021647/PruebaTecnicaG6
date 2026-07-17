import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import { validateAuthToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate-request.middleware.js';
import {
  createEventValidator,
  idParamValidator,
  updateEventValidator,
} from '../validators/event.validator.js';

const router = Router();

router.get('/', eventController.listEvents);
router.get(
  '/:id/capacity',
  idParamValidator,
  validateRequest,
  eventController.getEventCapacity
);
router.get('/:id', idParamValidator, validateRequest, eventController.getEvent);
router.post(
  '/',
  validateAuthToken,
  createEventValidator,
  validateRequest,
  eventController.createEvent
);
router.put(
  '/:id',
  validateAuthToken,
  updateEventValidator,
  validateRequest,
  eventController.updateEvent
);
router.delete(
  '/:id',
  validateAuthToken,
  idParamValidator,
  validateRequest,
  eventController.deleteEvent
);

export default router;
