import { eventsHttp } from './http.js';

function unwrap(response) {
  return response?.data?.data ?? response?.data;
}

export async function listEventsRequest() {
  const response = await eventsHttp.get('/events');
  return unwrap(response);
}

export async function searchEventsRequest(params = {}) {
  const response = await eventsHttp.get('/events', { params });

  return {
    events: response?.data?.data || [],
    pagination: response?.data?.pagination || {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
    },
  };
}

export async function getEventCapacityRequest(id) {
  const response = await eventsHttp.get(`/events/${id}/capacity`);
  return unwrap(response);
}

export async function getEventRequest(id) {
  const response = await eventsHttp.get(`/events/${id}`);
  return unwrap(response);
}

export async function createEventRequest(payload) {
  const response = await eventsHttp.post('/events', payload);
  return unwrap(response);
}

export async function updateEventRequest(id, payload) {
  const response = await eventsHttp.put(`/events/${id}`, payload);
  return unwrap(response);
}

export async function deleteEventRequest(id) {
  const response = await eventsHttp.delete(`/events/${id}`);
  return unwrap(response);
}

export function normalizeEventError(error) {
  const payload = error?.response?.data;

  return {
    message: payload?.message || 'No se pudo completar la operacion.',
    errors: Array.isArray(payload?.errors) ? payload.errors : [],
  };
}
