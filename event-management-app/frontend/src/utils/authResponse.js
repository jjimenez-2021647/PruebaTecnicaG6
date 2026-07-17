export function normalizeAuthError(error) {
  const response = error?.response?.data;

  if (!response) {
    return {
      message: 'No se pudo contactar el servicio de autenticacion.',
      errors: [],
    };
  }

  return {
    message: response.message || response.error || 'Solicitud rechazada.',
    errors: Array.isArray(response.errors) ? response.errors : [],
    code: response.error,
  };
}

export function normalizeSession(response) {
  const token = response?.token || response?.accessToken;
  const user = response?.userDetails || response?.user || response?.data || null;

  if (!token) {
    throw new Error('El Auth Service no devolvio token de acceso.');
  }

  return {
    token,
    accessToken: response?.accessToken || token,
    refreshToken: response?.refreshToken || null,
    expiresAt: response?.expiresAt || null,
    user,
  };
}
