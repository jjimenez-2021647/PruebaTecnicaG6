import { motion } from 'framer-motion';
import { AlertCircle, CalendarDays, CircleGauge, MapPin, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getAvailableEventsRequest,
  getFullEventsRequest,
  normalizeRegistrationError,
} from '../api/registrationsApi.js';

const copy = {
  available: {
    eyebrow: 'Disponibilidad',
    title: 'Eventos con cupos disponibles',
    emptyTitle: 'No hay eventos disponibles',
    emptyText: 'Todos los eventos registrados estan llenos o no hay eventos activos para mostrar.',
    load: getAvailableEventsRequest,
  },
  full: {
    eyebrow: 'Capacidad completa',
    title: 'Eventos llenos',
    emptyTitle: 'No hay eventos llenos',
    emptyText: 'Cuando un evento llegue a su capacidad maxima aparecera en esta vista.',
    load: getFullEventsRequest,
  },
};

function ReportEventCard({ event }) {
  return (
    <article className="report-card">
      <div className="report-card-head">
        <span className={event.status === 'FULL' ? 'status-badge status-cancelled' : 'status-badge status-active'}>
          {event.status === 'FULL' ? 'Lleno' : 'Disponible'}
        </span>
        <strong>{event.occupancyPercentage}%</strong>
      </div>
      <h2>{event.name}</h2>
      <div className="report-meta">
        <span>
          <MapPin size={16} strokeWidth={1.8} />
          {event.place}
        </span>
        <span>
          <CalendarDays size={16} strokeWidth={1.8} />
          {new Date(event.date).toLocaleDateString('es-GT')}
        </span>
        <span>
          <UsersRound size={16} strokeWidth={1.8} />
          {event.registered}/{event.capacity} inscritos
        </span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${event.occupancyPercentage}%` }} />
      </div>
      <div className="report-foot">
        <span>Cupos libres</span>
        <strong>{event.available}</strong>
      </div>
    </article>
  );
}

export function EventReportPage({ type = 'available' }) {
  const view = copy[type] || copy.available;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        setLoading(true);
        const data = await view.load();
        if (!active) return;
        setEvents(data);
        setError('');
      } catch (requestError) {
        if (!active) return;
        setError(normalizeRegistrationError(requestError).message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEvents();
    return () => {
      active = false;
    };
  }, [view]);

  return (
    <motion.section
      className="report-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="page-heading">
        <div>
          <p className="eyebrow">{view.eyebrow}</p>
          <h1>{view.title}</h1>
        </div>
        <CircleGauge size={34} strokeWidth={1.5} />
      </div>

      {loading ? <div className="event-skeleton">Cargando eventos...</div> : null}
      {error ? (
        <div className="alert alert-error">
          <AlertCircle size={18} strokeWidth={1.8} />
          <p>{error}</p>
          <span />
        </div>
      ) : null}
      {!loading && !error && !events.length ? (
        <div className="empty-state">
          <h2>{view.emptyTitle}</h2>
          <p>{view.emptyText}</p>
        </div>
      ) : null}
      {!loading && !error && events.length ? (
        <div className="report-grid">
          {events.map((event) => (
            <ReportEventCard key={event.eventId} event={event} />
          ))}
        </div>
      ) : null}
    </motion.section>
  );
}
