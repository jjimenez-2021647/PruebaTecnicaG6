import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { forgotPasswordRequest } from '../api/authApi.js';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { normalizeAuthError } from '../utils/authResponse.js';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.includes('@')) {
      setError({ message: 'Ingresa un correo valido.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPasswordRequest({ email });
      setSuccess(response.message || 'Si el correo existe, se envio el enlace.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Recuperacion"
      title="Solicita un token para cambiar la contrasena."
      copy="El servicio responde de forma segura sin revelar si el correo existe."
      aside={<p>Luego pega el token recibido en la pantalla de reseteo.</p>}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="form-kicker">Password</p>
          <h2>Recuperar</h2>
        </div>
        <Alert tone="success" message={success} />
        <Alert tone="error" message={error?.message} details={error?.errors || []} />
        <Field
          id="forgot-email"
          name="email"
          label="Correo"
          icon={Mail}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" isLoading={isLoading}>
          Enviar enlace
        </Button>
        <p className="form-switch">
          Ya tenes token? <Link to="/reset-password">Resetear contrasena</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
