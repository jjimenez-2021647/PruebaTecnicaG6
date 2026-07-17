import { eventsHttp } from './http.js';

function unwrap(response) {
  return response?.data?.data ?? response?.data;
}

export async function listEventsRequest(params) {
  const response = await eventsHttp.get('/events', { params });
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
  const body = buildEventBody(payload);
  const response = await eventsHttp.post('/events', body, getEventRequestConfig(body));
  return unwrap(response);
}

export async function updateEventRequest(id, payload) {
  const body = buildEventBody(payload);
  const response = await eventsHttp.put(`/events/${id}`, body, getEventRequestConfig(body));
  return unwrap(response);
}

function buildEventBody(payload) {
  if (!payload?.eventImage) return payload;

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (key === 'eventImage') {
      formData.append('eventImage', value);
      return;
    }
    formData.append(key, String(value));
  });

  return formData;
}

function getEventRequestConfig(body) {
  if (body instanceof FormData) {
    return { headers: { 'Content-Type': 'multipart/form-data' } };
  }

  return undefined;
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
