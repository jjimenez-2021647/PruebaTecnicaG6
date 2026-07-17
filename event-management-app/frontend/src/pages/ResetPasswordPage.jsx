import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { resetPasswordRequest } from '../api/authApi.js';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { normalizeAuthError } from '../utils/authResponse.js';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [values, setValues] = useState({
    token: params.get('token') || '',
    newPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!values.token.trim() || values.newPassword.length < 8) {
      setError({ message: 'Token requerido y contrasena minima de 8 caracteres.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPasswordRequest(values);
      setSuccess(response.message || 'Contrasena actualizada.');
      setValues({ token: '', newPassword: '' });
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Nuevo acceso"
      title="Cambia la contrasena con el token de recuperacion."
      copy="La nueva contrasena se guarda solo desde el AuthService; el frontend no calcula nada sensible."
      aside={<p>Despues del cambio, vuelve al login e inicia sesion con la nueva clave.</p>}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="form-kicker">Reset</p>
          <h2>Nueva clave</h2>
        </div>
        <Alert tone="success" message={success} />
        <Alert tone="error" message={error?.message} details={error?.errors || []} />
        <Field
          id="reset-token"
          name="token"
          label="Token de recuperacion"
          icon={ShieldCheck}
          value={values.token}
          onChange={handleChange}
        />
        <Field
          id="newPassword"
          name="newPassword"
          label="Nueva contrasena"
          icon={KeyRound}
          type="password"
          value={values.newPassword}
          onChange={handleChange}
        />
        <Button type="submit" isLoading={isLoading}>
          Guardar contrasena
        </Button>
        <p className="form-switch">
          <Link to="/login">Volver al login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
