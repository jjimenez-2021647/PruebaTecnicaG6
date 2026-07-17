import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { resendVerificationRequest } from '../api/authApi.js';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { normalizeAuthError } from '../utils/authResponse.js';

export function ResendVerificationPage() {
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
      const response = await resendVerificationRequest({ email });
      setSuccess(response.message || 'Correo de verificacion reenviado.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Reenvio"
      title="Pedi otro enlace sin crear un usuario duplicado."
      copy="Este flujo llama a /resend-verification y respeta la respuesta del AuthService."
      aside={<p>Usa el mismo correo con el que registraste la cuenta.</p>}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="form-kicker">Verificacion</p>
          <h2>Reenviar</h2>
        </div>
        <Alert tone="success" message={success} />
        <Alert tone="error" message={error?.message} details={error?.errors || []} />
        <Field
          id="email"
          name="email"
          label="Correo"
          icon={Mail}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" isLoading={isLoading}>
          Reenviar correo
        </Button>
        <p className="form-switch">
          Ya tenes token? <Link to="/verify-email">Verificar correo</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
