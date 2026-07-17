import axios from 'axios';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export async function getEvent(eventId) {
  try {
    const response = await axios.get(`${env.eventsServiceUrl}/events/${eventId}`, {
      timeout: env.httpTimeoutMs,
    });
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) throw new AppError('Evento no encontrado', 404);
    throw new AppError('service-events no esta disponible', 503);
  }
}
