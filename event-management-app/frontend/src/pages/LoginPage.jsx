import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getHomePathForUser } from '../utils/roles.js';

const initialValues = {
  emailOrUsername: '',
  password: '',
};

function validate(values) {
  const errors = {};

  if (!values.emailOrUsername.trim()) {
    errors.emailOrUsername = 'Ingresa tu correo o usuario.';
  }

  if (!values.password) {
    errors.password = 'Ingresa tu contrasena.';
  }

  return errors;
}

export function LoginPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, notice, dismissNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setServerError(null);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsLoading(true);
    const result = await login(values);
    setIsLoading(false);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    navigate(from || getHomePathForUser(result.session.user), { replace: true });
  };

  return (
    <AuthLayout
      eyebrow="Acceso operativo"
      title="Una sesion limpia para controlar el flujo del evento."
      copy="El frontend usa exactamente el contrato del AuthService: emailOrUsername, password y token Bearer."
      aside={
        <p>
          Usa el admin semilla si ya levantaste PostgreSQL: bibliotecain6bm@gmail.com.
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="form-kicker">Login</p>
          <h2>Entrar</h2>
        </div>

        <Alert tone="warning" message={notice} onClose={dismissNotice} />
        <Alert
          tone="error"
          message={serverError?.message}
          details={serverError?.errors || []}
        />

        <Field
          id="emailOrUsername"
          name="emailOrUsername"
          label="Correo o usuario"
          icon={Mail}
          value={values.emailOrUsername}
          onChange={handleChange}
          error={errors.emailOrUsername}
          autoComplete="username"
        />

        <Field
          id="password"
          name="password"
          label="Contrasena"
          icon={KeyRound}
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button type="submit" isLoading={isLoading}>
          Iniciar sesion
        </Button>

        <p className="form-switch">
          <Link to="/forgot-password">Olvide mi contrasena</Link>
        </p>

        <p className="form-switch">
          No tenes cuenta? <Link to="/register">Crear usuario</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
