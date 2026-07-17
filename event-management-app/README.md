# Event Management App

Sistema distribuido para administracion de eventos. Esta entrega cubre el trabajo del Integrante 1: auditoria del AuthService existente, base de seguridad JWT compartida y frontend de autenticacion.

## Arquitectura actual

```text
frontend React/Vite
  -> AuthService HTTP
      -> PostgreSQL

shared/auth
  -> middleware reutilizable para validar JWT en service-events y service-registrations
```

Carpetas:

- `AuthService`: servicio existente de autenticacion, conservado en Node.js, Express, Sequelize, PostgreSQL, Argon2 y JWT.
- `frontend`: React, React Router, Axios, Context API, Framer Motion, GSAP, Lenis y Lucide SVG icons.
- `shared/auth`: middleware JWT reutilizable para los servicios siguientes.
- `service-events`: reservado para Integrante 2 y 3.
- `service-registrations`: reservado para Integrante 4 y 5.

## AuthService detectado

Base path: `/api/v1`.

Endpoints principales:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/profile`
- `POST /api/v1/auth/logout`
- `GET /api/v1/health`

Payload de registro:

```json
{
  "name": "Admin",
  "surname": "Demo",
  "username": "admin.demo",
  "email": "admin@example.com",
  "password": "Password123",
  "phone": "12345678"
}
```

Payload de login:

```json
{
  "emailOrUsername": "admin@example.com",
  "password": "Password123"
}
```

Respuesta de login:

```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "jwt",
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "userDetails": {},
  "expiresAt": "2026-07-17T00:00:00.000Z"
}
```

JWT detectado:

- Firma con `JWT_SECRET`.
- Usa `JWT_ISSUER` y `JWT_AUDIENCE`.
- Claims: `sub`, `jti`, `iat`, `role`, `email`, `name`, `surname`.

## Puertos

- Frontend: `3000`
- AuthService: `3006`
- PostgreSQL Docker: `5436:5432`

El puerto `3006` corresponde al AuthService. PostgreSQL usa `5436` en host y `5432` dentro del contenedor.

## Variables de entorno

AuthService:

- Ver `AuthService/.env.example`.
- El `.env` real fue conservado para no romper el servicio existente.

Frontend:

- Ver `frontend/.env.example`.
- `VITE_AUTH_API_URL=http://localhost:3006/api/v1/auth`
- `VITE_EVENTS_API_URL=http://localhost:3001/api/v1`
- `VITE_REGISTRATIONS_API_URL=http://localhost:3002/api/v1`

## Ejecucion

AuthService:

```bash
cd event-management-app/AuthService
docker compose up -d
npm install
npm run dev
```

Frontend:

```bash
cd event-management-app/frontend
npm install
npm run dev
```

Luego abrir:

```text
http://localhost:3000
```

## Frontend de autenticacion

Implementado:

- `/login`
- `/register`
- `/verify-email`
- `/resend-verification`
- `/forgot-password`
- `/reset-password`
- `/dashboard` protegida
- Persistencia de sesion en `localStorage`
- Interceptor Axios con `Authorization: Bearer TOKEN`
- Interceptor de `401` que limpia sesion y redirige a login
- Formularios controlados con validacion cliente
- Mensajes de error normalizados desde backend
- Cierre de sesion
- UI responsive sin emojis; iconos SVG por Lucide

## Division de trabajo

Integrante 1:

- Backend: integracion JWT y seguridad.
- Frontend: autenticacion.

Integrante 2:

- Backend: CRUD de eventos.
- Frontend: administracion de eventos.

Integrante 3:

- Backend: busqueda y consultas.
- Frontend: exploracion y filtros.

Integrante 4:

- Backend: inscripciones.
- Frontend: gestion de inscripciones.

Integrante 5:

- Backend: disponibilidad y resumen.
- Frontend: dashboard de ocupacion.

## Estado de esta entrega

Terminado:

- AuthService restaurado dentro del monorepo y conservado sin migrarlo.
- Contrato de AuthService documentado.
- Frontend de autenticacion implementado.
- Middleware JWT compartido creado para futuros servicios.

Pendiente para confirmar antes de continuar:

- Integrante 2: `service-events` y modulo frontend de administracion de eventos.

