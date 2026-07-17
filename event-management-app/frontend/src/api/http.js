import axios from 'axios';

export const authHttp = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3006/api/v1/auth',
  timeout: 12000,
});

export const eventsHttp = axios.create({
  baseURL: import.meta.env.VITE_EVENTS_API_URL || 'http://localhost:3001/api/v1',
  timeout: 12000,
});

export const registrationsHttp = axios.create({
  baseURL:
    import.meta.env.VITE_REGISTRATIONS_API_URL || 'http://localhost:3002/api/v1',
  timeout: 12000,
});

export function readStoredToken() {
  try {
    const session = JSON.parse(localStorage.getItem('event_auth_session'));
    return session?.token || session?.accessToken || null;
  } catch {
    return null;
  }
}

function attachToken(config) {
  const token = readStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

eventsHttp.interceptors.request.use(attachToken);
registrationsHttp.interceptors.request.use(attachToken);
authHttp.interceptors.request.use((config) => {
  const token = readStoredToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function registerUnauthorizedHandler(handler) {
  const onRejected = (error) => {
    if (error?.response?.status === 401) {
      handler?.(error);
    }

    return Promise.reject(error);
  };

  const authId = authHttp.interceptors.response.use((response) => response, onRejected);
  const eventsId = eventsHttp.interceptors.response.use(
    (response) => response,
    onRejected
  );
  const registrationsId = registrationsHttp.interceptors.response.use(
    (response) => response,
    onRejected
  );

  return () => {
    authHttp.interceptors.response.eject(authId);
    eventsHttp.interceptors.response.eject(eventsId);
    registrationsHttp.interceptors.response.eject(registrationsId);
  };
}
