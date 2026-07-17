import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { verifyEmailRequest } from '../api/authApi.js';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { normalizeAuthError } from '../utils/authResponse.js';

const verificationRequests = new Map();

function tokenStorageKey(token) {
  return `verified-email-token:${token}`;
}

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get('token') || '');
  const userId = params.get('userId') || '';
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(() =>
    token && localStorage.getItem(tokenStorageKey(token))
      ? 'Correo verificado exitosamente. Ya podes iniciar sesion.'
      : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const didAutoVerify = useRef(false);

  const verifyToken = useCallback(async (rawToken, rawUserId = '') => {
    setError(null);

    if (!rawToken.trim()) {
      setError({ message: 'Ingresa el token de verificacion.' });
      return;
    }

    const cleanToken = rawToken.trim();
    const cleanUserId = rawUserId.trim();
    const storageKey = tokenStorageKey(cleanToken);

    if (localStorage.getItem(storageKey)) {
      setSuccess('Correo verificado exitosamente. Ya podes iniciar sesion.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const requestKey = `${cleanToken}:${cleanUserId}`;
      const request =
        verificationRequests.get(requestKey) ||
        verifyEmailRequest({
          token: cleanToken,
          ...(cleanUserId ? { userId: cleanUserId } : {}),
        });

      verificationRequests.set(requestKey, request);

      const response = await request;
      localStorage.setItem(storageKey, 'true');
      setSuccess(response.message || 'Correo verificado. Ya podes iniciar sesion.');
      setToken('');
    } catch (requestError) {
      const status = requestError?.response?.status;
      const message = requestError?.response?.data?.message || '';

      if (status === 404 && message.toLowerCase().includes('token')) {
        localStorage.setItem(storageKey, 'true');
        setSuccess('Correo verificado exitosamente. Ya podes iniciar sesion.');
        setToken('');
        return;
      }

      setError(normalizeAuthError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && !success && !didAutoVerify.current) {
      didAutoVerify.current = true;
      verifyToken(token, userId);
    }
  }, [success, token, userId, verifyToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    verifyToken(token, userId);
  };

  return (
    <AuthLayout
      eyebrow="Verificacion"
      title="Activa la cuenta con el token que envio AuthService."
      copy="El backend valida el token real y marca el correo como verificado en PostgreSQL."
      aside={<p>Si el enlace no abre directo, pega aqui el token recibido por correo.</p>}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="form-kicker">Correo</p>
          <h2>Verificar</h2>
        </div>
        <Alert tone="success" message={success} />
        <Alert tone="error" message={error?.message} details={error?.errors || []} />
        {isLoading ? (
          <Alert tone="success" message="Verificando token con AuthService..." />
        ) : null}
        {!success ? (
          <>
            <Field
              id="token"
              name="token"
              label="Token de verificacion"
              icon={BadgeCheck}
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
            <Button type="submit" isLoading={isLoading}>
              Verificar correo
            </Button>
          </>
        ) : (
          <Link className="button auth-success-action" to="/login">
            <span className="button-label">Iniciar sesion</span>
            <span className="button-label button-label-next" aria-hidden="true">
              Iniciar sesion
            </span>
          </Link>
        )}
        <p className="form-switch">
          No llego? <Link to="/resend-verification">Reenviar verificacion</Link>
        </p>
        <p className="form-switch">
          <Link to="/login">Volver al login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
