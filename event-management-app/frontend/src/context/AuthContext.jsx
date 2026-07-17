import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, logoutRequest, profileRequest, registerRequest } from '../api/authApi.js';
import { registerUnauthorizedHandler } from '../api/http.js';
import { AuthContext } from './authContextValue.js';
import { normalizeAuthError, normalizeSession } from '../utils/authResponse.js';

const STORAGE_KEY = 'event_auth_session';
const NOTICE_KEY = 'event_auth_notice';

function loadStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => loadStoredSession());
  const [notice, setNotice] = useState(() => localStorage.getItem(NOTICE_KEY));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const persistSession = useCallback((nextSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  const clearSession = useCallback((message) => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);

    if (message) {
      localStorage.setItem(NOTICE_KEY, message);
      setNotice(message);
    }
  }, []);

  useEffect(() => {
    const stored = loadStoredSession();

    if (!stored?.token) {
      setIsBootstrapping(false);
      return;
    }

    profileRequest()
      .then((response) => {
        const user = response?.data || response?.user || stored.user;
        persistSession({ ...stored, user });
      })
      .catch(() => {
        clearSession('Tu sesion vencio. Inicia sesion nuevamente.');
      })
      .finally(() => setIsBootstrapping(false));
  }, [clearSession, persistSession]);

  useEffect(() => {
    return registerUnauthorizedHandler(() => {
      clearSession('Tu sesion vencio. Inicia sesion nuevamente.');
      navigate('/login', { replace: true });
    });
  }, [clearSession, navigate]);

  const dismissNotice = useCallback(() => {
    localStorage.removeItem(NOTICE_KEY);
    setNotice(null);
  }, []);

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await loginRequest(credentials);
        const nextSession = normalizeSession(response);
        persistSession(nextSession);
        dismissNotice();
        return { ok: true, session: nextSession };
      } catch (error) {
        return { ok: false, error: normalizeAuthError(error) };
      }
    },
    [dismissNotice, persistSession]
  );

  const register = useCallback(async (payload) => {
    try {
      const response = await registerRequest(payload);
      return { ok: true, response };
    } catch (error) {
      return { ok: false, error: normalizeAuthError(error) };
    }
  }, []);

  const updateSessionUser = useCallback(
    (nextUser) => {
      setSession((current) => {
        if (!current) return current;
        const nextSession = {
          ...current,
          user: { ...(current.user || {}), ...(nextUser || {}) },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        return nextSession;
      });
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // The local session is still cleared if the server cannot answer.
    } finally {
      clearSession();
      navigate('/login', { replace: true });
    }
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      isAuthenticated: Boolean(session?.token),
      isBootstrapping,
      notice,
      login,
      register,
      updateSessionUser,
      logout,
      dismissNotice,
    }),
    [
      dismissNotice,
      isBootstrapping,
      login,
      logout,
      notice,
      register,
      session,
      updateSessionUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
