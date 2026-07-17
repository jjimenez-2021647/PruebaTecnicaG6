import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, KeyRound, Mail, UserPlus, UsersRound } from 'lucide-react';
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

      <section className="login-roadmap" aria-label="Roadmap de la aplicacion">
        <div className="section-title">
          <span>Roadmap rapido</span>
          <strong>Flujo de uso</strong>
        </div>
        <div className="roadmap-steps">
          <article>
            <UserPlus size={18} strokeWidth={1.8} />
            <span>1</span>
            <strong>Crear cuenta</strong>
            <p>Registrate, verifica tu correo e inicia sesion.</p>
          </article>
          <article>
            <CalendarDays size={18} strokeWidth={1.8} />
            <span>2</span>
            <strong>Crear eventos</strong>
            <p>Publica eventos con fecha, cupos, lugar e imagen.</p>
          </article>
          <article>
            <UsersRound size={18} strokeWidth={1.8} />
            <span>3</span>
            <strong>Unirse</strong>
            <p>Explora eventos de otros usuarios y participa.</p>
          </article>
          <article>
            <BarChart3 size={18} strokeWidth={1.8} />
            <span>4</span>
            <strong>Revisar reportes</strong>
            <p>Consulta disponibilidad, llenos y registros.</p>
          </article>
        </div>
      </section>
    </AuthLayout>
  );
}
