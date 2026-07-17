import { Event } from '../models/event.model.js';
import { AppError } from '../utils/app-error.js';
import {
  assertNoActiveRegistrations,
  getActiveRegistrationCount,
} from './registration-guard.service.js';

export async function listEvents() {
  return Event.find().sort({ date: 1, createdAt: -1 });
}

export async function getEventById(id) {
  const event = await Event.findById(id);

  if (!event) {
    throw new AppError('Evento no encontrado', 404);
  }

  return event;
}

export async function createEvent(payload, auth) {
  return Event.create({
    ...payload,
    createdBy: auth?.userId || null,
  });
}

export async function updateEvent(id, payload) {
  const currentEvent = await getEventById(id);

  if (
    payload.capacity !== undefined &&
    Number(payload.capacity) < Number(currentEvent.capacity)
  ) {
    const activeCount = await getActiveRegistrationCount(id);

    if (activeCount !== null && Number(payload.capacity) < activeCount) {
      throw new AppError(
        'No se puede reducir la capacidad por debajo de las inscripciones activas',
        409
      );
    }
  }

  Object.assign(currentEvent, payload);
  await currentEvent.save();
  return currentEvent;
}

export async function deleteEvent(id) {
  const event = await getEventById(id);
  await assertNoActiveRegistrations(id);
  await event.deleteOne();
  return event;
}
