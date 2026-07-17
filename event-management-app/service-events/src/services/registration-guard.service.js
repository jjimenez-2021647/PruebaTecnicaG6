import axios from 'axios';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

function normalizeRegistrations(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

export async function getActiveRegistrationCount(eventId) {
  if (!env.registrationsServiceUrl) {
    return null;
  }

  try {
    const response = await axios.get(`${env.registrationsServiceUrl}/registrations`, {
      params: { eventId },
      timeout: env.httpTimeoutMs,
    });

    return normalizeRegistrations(response.data).filter(
      (registration) => registration.status === 'active'
    ).length;
  } catch (error) {
    if (error.response?.status === 404) {
      return 0;
    }

    throw new AppError('No se pudo validar inscripciones activas', 503);
  }
}

export async function assertNoActiveRegistrations(eventId) {
  const activeCount = await getActiveRegistrationCount(eventId);

  if (activeCount && activeCount > 0) {
    throw new AppError(
      'No se puede eliminar un evento con inscripciones activas',
      409
    );
  }
}
