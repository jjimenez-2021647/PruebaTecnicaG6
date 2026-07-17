import * as registrationService from '../services/registration.service.js';
import { success } from '../utils/responses.js';

export async function listRegistrations(req, res, next) {
  try {
    const filters = req.query.eventId ? { eventId: req.query.eventId } : {};
    const registrations = await registrationService.listRegistrations(filters);
    return success(res, 200, 'Inscripciones obtenidas correctamente', registrations);
  } catch (error) {
    return next(error);
  }
}

export async function createRegistration(req, res, next) {
  try {
    const data = await registrationService.createRegistration(req.body, req.auth);
    return success(res, 201, 'Inscripcion creada correctamente', data.registration, {
      occupancy: data.occupancy,
    });
  } catch (error) {
    return next(error);
  }
}

export async function cancelRegistration(req, res, next) {
  try {
    const data = await registrationService.cancelRegistration(req.params.id);
    return success(res, 200, 'Inscripcion cancelada correctamente', data.registration, {
      occupancy: data.occupancy,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAttendees(req, res, next) {
  try {
    const data = await registrationService.getAttendees(req.params.id);
    return success(res, 200, 'Asistentes obtenidos correctamente', data.attendees, {
      occupancy: data.occupancy,
    });
  } catch (error) {
    return next(error);
  }
}
