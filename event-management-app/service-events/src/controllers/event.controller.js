import * as eventService from '../services/event.service.js';
import { success } from '../utils/responses.js';

export async function listEvents(req, res, next) {
  try {
    const { events, pagination } = await eventService.listEvents(req.query);
    return success(res, 200, 'Eventos obtenidos correctamente', events, {
      pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEventCapacity(req, res, next) {
  try {
    const capacity = await eventService.getEventCapacity(req.params.id);
    return success(res, 200, 'Capacidad obtenida correctamente', capacity);
  } catch (error) {
    return next(error);
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await eventService.getEventById(req.params.id);
    return success(res, 200, 'Evento obtenido correctamente', event);
  } catch (error) {
    return next(error);
  }
}

export async function createEvent(req, res, next) {
  try {
    const event = await eventService.createEvent(req.body, req.auth);
    return success(res, 201, 'Evento creado correctamente', event);
  } catch (error) {
    return next(error);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    return success(res, 200, 'Evento actualizado correctamente', event);
  } catch (error) {
    return next(error);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await eventService.deleteEvent(req.params.id);
    return success(res, 200, 'Evento eliminado correctamente', event);
  } catch (error) {
    return next(error);
  }
}
