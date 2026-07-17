import { Event } from '../models/event.model.js';
import { AppError } from '../utils/app-error.js';
import {
  assertNoActiveRegistrations,
  getActiveRegistrationCount,
} from './registration-guard.service.js';

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const allowedSortFields = ['name', 'date', 'place', 'capacity', 'status', 'createdAt'];

export async function listEvents(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'date';
  const order = query.order === 'desc' ? -1 : 1;
  const filters = {};

  const search = String(query.search || query.name || '').trim();
  if (search) {
    filters.name = { $regex: escapeRegex(search).slice(0, 80), $options: 'i' };
  }

  const place = String(query.place || '').trim();
  if (place) {
    filters.place = { $regex: escapeRegex(place).slice(0, 80), $options: 'i' };
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.date) {
    const start = new Date(query.date);
    if (!Number.isNaN(start.getTime())) {
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filters.date = { $gte: start, $lt: end };
    }
  }

  const [events, totalItems] = await Promise.all([
    Event.find(filters)
      .sort({ [sortBy]: order, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Event.countDocuments(filters),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
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

export async function getEventCapacity(id) {
  const event = await getEventById(id);

  return {
    eventId: event.id,
    capacity: event.capacity,
  };
}
