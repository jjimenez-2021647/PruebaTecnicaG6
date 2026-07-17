import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { EventStatusBadge } from '../components/EventStatusBadge.jsx';
import {
  deleteEventRequest,
  listEventsRequest,
  normalizeEventError,
} from '../api/eventsApi.js';
import { formatEventDate } from '../utils/events.js';

export function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events]
  );

  async function loadEvents() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listEventsRequest();
      setEvents(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(normalizeEventError(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteEventRequest(eventToDelete.id);
      setEvents((current) => current.filter((event) => event.id !== eventToDelete.id));
      setNotice('Evento eliminado correctamente.');
      setEventToDelete(null);
    } catch (requestError) {
      setError(normalizeEventError(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="events-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Eventos</p>
          <h1>Administracion de eventos</h1>
        </div>
        <Link className="button page-action" to="/events/new">
          <span className="button-label">
            <CalendarPlus size={18} strokeWidth={1.8} />
            Crear evento
          </span>
          <span className="button-label button-label-next" aria-hidden="true">
            Crear evento
          </span>
        </Link>
      </header>

      <Alert tone="success" message={notice} onClose={() => setNotice(null)} />
      <Alert tone="error" message={error?.message} details={error?.errors || []} />

      {isLoading ? (
        <div className="event-skeleton">Cargando eventos</div>
      ) : null}

      {!isLoading && !sortedEvents.length ? (
        <div className="empty-state">
          <h2>No hay eventos todavia.</h2>
          <p>Crea el primer evento para habilitar la administracion del calendario.</p>
          <Link className="quiet-link" to="/events/new">
            Crear evento
          </Link>
        </div>
      ) : null}

      {!isLoading && sortedEvents.length ? (
        <div className="events-table" role="table" aria-label="Eventos registrados">
          <div className="events-row events-head" role="row">
            <span>Evento</span>
            <span>Fecha</span>
            <span>Lugar</span>
            <span>Capacidad</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>
          {sortedEvents.map((event) => (
            <article className="events-row" key={event.id} role="row">
              <strong>{event.name}</strong>
              <span>{formatEventDate(event.date)}</span>
              <span>{event.place}</span>
              <span>{event.capacity}</span>
              <EventStatusBadge status={event.status} />
              <div className="row-actions">
                <Link to={`/events/${event.id}`} aria-label={`Ver ${event.name}`}>
                  <Eye size={18} strokeWidth={1.8} />
                </Link>
                <Link to={`/events/${event.id}/edit`} aria-label={`Editar ${event.name}`}>
                  <Pencil size={18} strokeWidth={1.8} />
                </Link>
                <button
                  type="button"
                  onClick={() => setEventToDelete(event)}
                  aria-label={`Eliminar ${event.name}`}
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(eventToDelete)}
        title="Eliminar evento"
        message={`Se eliminara "${eventToDelete?.name}". Esta accion se bloquea si existen inscripciones activas.`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onCancel={() => setEventToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
