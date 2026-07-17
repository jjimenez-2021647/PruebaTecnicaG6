import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AtSign, KeyRound, Mail, Phone, UserRound } from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { useAuth } from '../hooks/useAuth.js';

const initialValues = {
  name: '',
  surname: '',
  username: '',
  email: '',
  phone: '',
  password: '',
};

function validate(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (!values.surname.trim()) errors.surname = 'El apellido es obligatorio.';
  if (!values.username.trim()) errors.username = 'El usuario es obligatorio.';
  if (!emailPattern.test(values.email)) errors.email = 'Correo invalido.';
  if (!/^\d{8}$/.test(values.phone)) errors.phone = 'Usa 8 digitos.';
  if (values.password.length < 8) {
    errors.password = 'Minimo 8 caracteres.';
  }

  return errors;
}

export function RegisterPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

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
    setSuccess(null);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsLoading(true);
    const result = await register(values);
    setIsLoading(false);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    setSuccess(
      result.response?.message ||
        'Usuario registrado. Revisa el correo de verificacion antes de iniciar sesion.'
    );
    setValues(initialValues);
  };

  return (
    <AuthLayout
      eyebrow="Alta de usuario"
      title="Registro directo contra PostgreSQL, sin usuarios duplicados."
      copy="El formulario respeta los campos reales del backend y deja que el servidor entregue los errores finales."
      aside={<p>La cuenta queda pendiente de verificacion de correo segun el AuthService.</p>}
    >
      <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
        <div>
          <p className="form-kicker">Registro</p>
          <h2>Crear cuenta</h2>
        </div>

        <Alert tone="success" message={success} />
        <Alert
          tone="error"
          message={serverError?.message}
          details={serverError?.errors || []}
        />

        <div className="field-grid">
          <Field
            id="name"
            name="name"
            label="Nombre"
            icon={UserRound}
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="given-name"
          />
          <Field
            id="surname"
            name="surname"
            label="Apellido"
            icon={UserRound}
            value={values.surname}
            onChange={handleChange}
            error={errors.surname}
            autoComplete="family-name"
          />
        </div>

        <Field
          id="username"
          name="username"
          label="Usuario"
          icon={AtSign}
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />

        <Field
          id="email"
          name="email"
          label="Correo"
          icon={Mail}
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Field
          id="phone"
          name="phone"
          label="Telefono"
          icon={Phone}
          inputMode="numeric"
          maxLength="8"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
        />

        <Field
          id="register-password"
          name="password"
          label="Contrasena"
          icon={KeyRound}
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <Button type="submit" isLoading={isLoading}>
          Registrar
        </Button>

        <p className="form-switch">
          Ya tenes cuenta? <Link to="/login">Iniciar sesion</Link>
        </p>
        <p className="form-switch">
          Ya tenes token? <Link to="/verify-email">Verificar correo</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
