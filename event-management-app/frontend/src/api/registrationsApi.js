import { registrationsHttp } from './http.js';

export async function listRegistrationsRequest(eventId) {
  const response = await registrationsHttp.get('/registrations', { params: { eventId } });
  return response.data.data || [];
}

export async function createRegistrationRequest(payload) {
  const response = await registrationsHttp.post('/registrations', payload);
  return { registration: response.data.data, occupancy: response.data.occupancy };
}

export async function cancelRegistrationRequest(id) {
  const response = await registrationsHttp.delete(`/registrations/${id}`);
  return { registration: response.data.data, occupancy: response.data.occupancy };
}

export async function getAttendeesRequest(eventId) {
  const response = await registrationsHttp.get(`/events/${eventId}/attendees`);
  return { attendees: response.data.data || [], occupancy: response.data.occupancy };
}

export function normalizeRegistrationError(error) {
  const payload = error?.response?.data;
  return {
    message: payload?.message || 'No se pudo completar la operacion.',
    errors: Array.isArray(payload?.errors) ? payload.errors : [],
  };
}
