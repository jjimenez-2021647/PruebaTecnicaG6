# Event Management App

Sistema distribuido para administracion de eventos. Esta entrega cubre Integrantes 1 a 4: autenticacion, eventos, busqueda avanzada e inscripciones.

## Arquitectura actual

```text
frontend React/Vite
  -> AuthService HTTP
      -> PostgreSQL
  -> service-events HTTP
      -> MongoDB
  -> service-registrations HTTP
      -> MongoDB

shared/auth
  -> middleware reutilizable para validar JWT en service-events y service-registrations
```

Carpetas:

- `AuthService`: servicio existente de autenticacion, conservado en Node.js, Express, Sequelize, PostgreSQL, Argon2 y JWT.
- `frontend`: React, React Router, Axios, Context API, Framer Motion, GSAP, Lenis y Lucide SVG icons.
- `shared/auth`: middleware JWT reutilizable para los servicios siguientes.
- `service-events`: CRUD de eventos con Node.js, Express, MongoDB, Mongoose y JWT.
- `service-registrations`: inscripciones, cancelacion y asistentes por evento.

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
- Events Service: `3001`
- Registrations Service: `3002`
- PostgreSQL Docker: `5436:5432`
- MongoDB: `27017`

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

Events Service:

- Ver `service-events/.env.example`.
- `JWT_SECRET`, `JWT_ISSUER` y `JWT_AUDIENCE` deben coincidir con AuthService.

Registrations Service:

- Ver `service-registrations/.env.example`.
- `EVENTS_SERVICE_URL` debe apuntar a `service-events`.
- `JWT_SECRET`, `JWT_ISSUER` y `JWT_AUDIENCE` deben coincidir con AuthService.

## Ejecucion

AuthService:

```bash
cd event-management-app/AuthService
docker compose up -d
pnpm install
pnpm run dev
```

Frontend:

```bash
cd event-management-app/frontend
pnpm install
pnpm run dev
```

Events Service:

```bash
cd event-management-app/service-events
pnpm install
pnpm run dev
```

Registrations Service:

```bash
cd event-management-app/service-registrations
pnpm install
pnpm run dev
```

Luego abrir:

```text
http://localhost:3000
```

Docker para MongoDB y Events Service:

```bash
cd event-management-app
copy .env.example .env
docker compose up --build
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

## Backend de eventos

Base path: `/api/v1/events`.

Endpoints:

- `GET /api/v1/events` publico.
- `GET /api/v1/events/:id` publico.
- `GET /api/v1/events/:id/capacity` publico.
- `POST /api/v1/events` protegido con JWT.
- `PUT /api/v1/events/:id` protegido con JWT.
- `DELETE /api/v1/events/:id` protegido con JWT.

Modelo:

- `name`
- `date`
- `place`
- `capacity`
- `description`
- `status`
- `createdBy`
- `createdAt`
- `updatedAt`

Estados validos: `draft`, `active`, `cancelled`, `completed`.

Reglas:

- La capacidad debe ser mayor que cero.
- Los ids invalidos devuelven `400`.
- Evento inexistente devuelve `404`.
- La eliminacion consulta `REGISTRATIONS_SERVICE_URL` cuando este configurado y bloquea si hay inscripciones activas.
- Si se reduce capacidad y existe servicio de inscripciones, se bloquea cuando la nueva capacidad sea menor a inscripciones activas.
- `GET /events` queda publico para exploracion; escritura requiere JWT.
- `GET /events` acepta `search`, `name`, `date`, `place`, `status`, `page`, `limit`, `sortBy` y `order`.
- La paginacion devuelve `pagination` con `page`, `limit`, `totalItems` y `totalPages`.

## Frontend de eventos

Rutas protegidas:

- `/events`
- `/events/new`
- `/events/:id`
- `/events/:id/edit`
- `/events/explore`

Incluye listado, detalle, crear, editar, eliminar con modal de confirmacion, estados de carga, estado vacio, errores y notificaciones.

La vista `/events/explore` agrega busqueda por nombre con debounce, filtros por fecha/lugar/estado, ordenamiento, paginacion y sincronizacion con query params.

## Backend de inscripciones

Base path: `/api/v1`.

Endpoints protegidos con JWT:

- `POST /api/v1/registrations`
- `GET /api/v1/registrations?eventId=...`
- `DELETE /api/v1/registrations/:id`
- `PATCH /api/v1/registrations/:id/cancel`
- `GET /api/v1/events/:id/attendees`

Reglas:

- Valida que el evento exista consultando `service-events`.
- No permite duplicar correo activo en el mismo evento.
- No permite registrar si no hay cupos.
- Cancelar es logico: cambia estado a `cancelled`.
- Una inscripcion cancelada libera cupo.
- Usa contador de ocupacion por evento para evitar sobrepasar capacidad en solicitudes concurrentes.

## Frontend de inscripciones

Rutas protegidas:

- `/registrations`
- `/events/:id/attendees`

Incluye seleccion de evento, formulario de asistente, capacidad/ocupados/restantes, listado de asistentes y cancelacion con confirmacion.

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
- Integrante 2: CRUD de eventos y administracion frontend.
- Integrante 3: filtros, paginacion, ordenamiento y exploracion frontend.
- Integrante 4: inscripciones, asistentes y cancelacion logica.

Pendiente para confirmar antes de continuar:

- Integrante 5: disponibilidad, resumen y dashboard de ocupacion.

