import axios from 'axios';
import { Registration } from '../models/registration.model.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

async function getEvents() {
  try {
    const response = await axios.get(`${env.eventsServiceUrl}/events`, {
      params: { limit: 50 },
      timeout: env.httpTimeoutMs,
    });
    return response.data.data || [];
  } catch {
    throw new AppError('service-events no esta disponible', 503);
  }
}

async function getCounts() {
  const rows = await Registration.aggregate([
    { $group: { _id: { eventId: '$eventId', status: '$status' }, total: { $sum: 1 } } },
  ]);
  const counts = new Map();
  rows.forEach((row) => {
    const current = counts.get(row._id.eventId) || { active: 0, cancelled: 0 };
    current[row._id.status] = row.total;
    counts.set(row._id.eventId, current);
  });
  return counts;
}

function combine(events, counts) {
  return events.map((event) => {
    const count = counts.get(event.id) || { active: 0, cancelled: 0 };
    const registered = count.active || 0;
    const available = Math.max(Number(event.capacity) - registered, 0);
    const occupancyPercentage = event.capacity
      ? Math.min(Math.round((registered / Number(event.capacity)) * 100), 100)
      : 0;
    return {
      eventId: event.id,
      name: event.name,
      date: event.date,
      place: event.place,
      capacity: event.capacity,
      registered,
      cancelled: count.cancelled || 0,
      available,
      occupancyPercentage,
      status: available <= 0 ? 'FULL' : 'AVAILABLE',
    };
  });
}

export async function buildReport() {
  const [events, counts] = await Promise.all([getEvents(), getCounts()]);
  const combined = combine(events, counts);
  const totals = combined.reduce(
    (acc, event) => {
      acc.totalCapacity += Number(event.capacity) || 0;
      acc.totalActiveRegistrations += event.registered;
      acc.totalCancelledRegistrations += event.cancelled;
      acc.availableSpots += event.available;
      if (event.status === 'FULL') acc.fullEvents += 1;
      if (event.status === 'AVAILABLE') acc.availableEvents += 1;
      return acc;
    },
    {
      totalCapacity: 0,
      totalActiveRegistrations: 0,
      totalCancelledRegistrations: 0,
      availableSpots: 0,
      fullEvents: 0,
      availableEvents: 0,
    }
  );

  return {
    totalEvents: combined.length,
    ...totals,
    occupancyPercentage: totals.totalCapacity
      ? Math.min(Math.round((totals.totalActiveRegistrations / totals.totalCapacity) * 100), 100)
      : 0,
    events: combined,
  };
}

export async function availableEvents() {
  const report = await buildReport();
  return report.events.filter((event) => event.status === 'AVAILABLE');
}

export async function fullEvents() {
  const report = await buildReport();
  return report.events.filter((event) => event.status === 'FULL');
}
