import { Router } from 'express';
import * as controller from '../controllers/registration.controller.js';
import { validateAuthToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate-request.middleware.js';
import {
  createRegistrationValidator,
  eventParamValidator,
  idParamValidator,
  listRegistrationValidator,
} from '../validators/registration.validator.js';

const router = Router();

router.use(validateAuthToken);
router.get('/registrations', listRegistrationValidator, validateRequest, controller.listRegistrations);
router.post('/registrations', createRegistrationValidator, validateRequest, controller.createRegistration);
router.delete('/registrations/:id', idParamValidator, validateRequest, controller.cancelRegistration);
router.patch('/registrations/:id/cancel', idParamValidator, validateRequest, controller.cancelRegistration);
router.get('/events/:id/attendees', eventParamValidator, validateRequest, controller.getAttendees);

export default router;
