# PruebaTecnicaG6

## Integrante 5 - Reportes y disponibilidad

Implementado sobre `service-registrations` y `frontend`.

### Backend

- `GET /api/v1/events/available`: eventos con cupos disponibles.
- `GET /api/v1/events/full`: eventos sin cupos.
- `GET /api/v1/summary`: resumen global de capacidad, inscripciones activas, canceladas, cupos libres y ocupacion por evento.

Los endpoints cruzan los eventos de `service-events` con las inscripciones guardadas en MongoDB. Si `service-events` no responde, el servicio devuelve `503`.

### Frontend

- `/dashboard`: tablero con resumen, accesos rapidos y avance por evento.
- `/availability`: listado de eventos disponibles.
- `/full-events`: listado de eventos llenos.
- `/summary`: tabla completa del reporte.

Todas las vistas tienen carga, vacio y error, y usan iconos SVG de `lucide-react`.
