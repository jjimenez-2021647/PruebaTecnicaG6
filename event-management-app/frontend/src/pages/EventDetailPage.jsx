import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Pencil, Trash2, Users } from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { EventStatusBadge } from '../components/EventStatusBadge.jsx';
import {
  deleteEventRequest,
  getEventRequest,
  normalizeEventError,
} from '../api/eventsApi.js';
import { formatEventDate } from '../utils/events.js';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getEventRequest(id)
      .then(setEvent)
      .catch((requestError) => setError(normalizeEventError(requestError)))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteEventRequest(id);
      navigate('/events', { replace: true });
    } catch (requestError) {
      setError(normalizeEventError(requestError));
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <section className="events-page">
      <Link className="quiet-link" to="/events">
        <ArrowLeft size={16} strokeWidth={1.8} />
        Volver a eventos
      </Link>

      <Alert tone="error" message={error?.message} details={error?.errors || []} />

      {isLoading ? <div className="event-skeleton">Cargando evento</div> : null}

      {!isLoading && event ? (
        <article className="event-detail">
          {event.imageUrl ? (
            <img className="event-detail-image" src={event.imageUrl} alt={event.name} />
          ) : null}
          <header>
            <div>
              <p className="eyebrow">Detalle</p>
              <h1>{event.name}</h1>
            </div>
            <EventStatusBadge status={event.status} />
          </header>

          <div className="detail-grid">
            <span>
              <CalendarDays size={20} strokeWidth={1.8} />
              {formatEventDate(event.date)}
            </span>
            <span>
              <MapPin size={20} strokeWidth={1.8} />
              {event.place}
            </span>
            <span>
              <Users size={20} strokeWidth={1.8} />
              {event.capacity} cupos
            </span>
          </div>

          <p className="event-description">
            {event.description || 'Sin descripcion registrada.'}
          </p>

          <div className="detail-actions">
            <Link className="secondary-button" to={`/events/${event.id}/edit`}>
              <Pencil size={18} strokeWidth={1.8} />
              Editar
            </Link>
            <button
              className="secondary-button danger"
              type="button"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={18} strokeWidth={1.8} />
              Eliminar
            </button>
          </div>
        </article>
      ) : null}

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar evento"
        message={`Se eliminara "${event?.name}". Esta accion se bloquea si existen inscripciones activas.`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
