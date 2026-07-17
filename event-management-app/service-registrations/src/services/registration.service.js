import { Registration } from '../models/registration.model.js';
import { Occupancy } from '../models/occupancy.model.js';
import { AppError } from '../utils/app-error.js';
import { getEvent } from './events-client.service.js';

async function reserveSpot(eventId, capacity) {
  await Occupancy.updateOne({ eventId }, { $setOnInsert: { activeCount: 0 } }, { upsert: true });
  const result = await Occupancy.findOneAndUpdate(
    { eventId, activeCount: { $lt: capacity } },
    { $inc: { activeCount: 1 } },
    { new: true }
  );
  if (!result) throw new AppError('Evento sin cupos disponibles', 409);
  return result.activeCount;
}

async function releaseSpot(eventId) {
  const result = await Occupancy.findOneAndUpdate(
    { eventId, activeCount: { $gt: 0 } },
    { $inc: { activeCount: -1 } },
    { new: true }
  );
  return result?.activeCount || 0;
}

export async function listRegistrations(filters = {}) {
  return Registration.find(filters).sort({ createdAt: -1 });
}

export async function createRegistration(payload, auth) {
  const event = await getEvent(payload.eventId);
  const activeCount = await reserveSpot(payload.eventId, event.capacity);

  try {
    const registration = await Registration.create({
      ...payload,
      registeredBy: auth?.userId || null,
      status: 'active',
    });
    return {
      registration,
      occupancy: {
        capacity: event.capacity,
        occupied: activeCount,
        available: Math.max(event.capacity - activeCount, 0),
      },
    };
  } catch (error) {
    await releaseSpot(payload.eventId);
    if (error.code === 11000) {
      throw new AppError('Este correo ya tiene una inscripcion activa en el evento', 409);
    }
    throw error;
  }
}

export async function cancelRegistration(id) {
  const registration = await Registration.findById(id);
  if (!registration) throw new AppError('Inscripcion no encontrada', 404);
  if (registration.status === 'cancelled') {
    throw new AppError('La inscripcion ya fue cancelada', 409);
  }
  registration.status = 'cancelled';
  registration.cancelledAt = new Date();
  await registration.save();
  const occupied = await releaseSpot(registration.eventId);
  return { registration, occupancy: { occupied } };
}

export async function getAttendees(eventId) {
  await getEvent(eventId);
  const attendees = await Registration.find({ eventId }).sort({ createdAt: -1 });
  const active = attendees.filter((item) => item.status === 'active').length;
  return { attendees, occupancy: { occupied: active } };
}
