import { motion } from 'framer-motion';
import { AlertCircle, BarChart3, CalendarCheck, CircleGauge, TicketCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  getAvailableEventsRequest,
  getFullEventsRequest,
  getSummaryRequest,
  normalizeRegistrationError,
} from '../api/registrationsApi.js';

const initialSummary = {
  totalEvents: 0,
  totalCapacity: 0,
  totalActiveRegistrations: 0,
  totalCancelledRegistrations: 0,
  availableSpots: 0,
  fullEvents: 0,
  availableEvents: 0,
  occupancyPercentage: 0,
  events: [],
};

function EventProgress({ event }) {
  return (
    <article className="report-row">
      <div>
        <strong>{event.name}</strong>
        <span>{event.place}</span>
      </div>
      <div className="progress-cell">
        <span>
          {event.registered}/{event.capacity}
        </span>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${event.occupancyPercentage}%` }} />
        </div>
      </div>
      <span className={event.status === 'FULL' ? 'status-badge status-cancelled' : 'status-badge status-active'}>
        {event.status === 'FULL' ? 'Lleno' : 'Disponible'}
      </span>
    </article>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(initialSummary);
  const [available, setAvailable] = useState([]);
  const [full, setFull] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        setLoading(true);
        const [summaryData, availableData, fullData] = await Promise.all([
          getSummaryRequest(),
          getAvailableEventsRequest(),
          getFullEventsRequest(),
        ]);
        if (!active) return;
        setSummary({ ...initialSummary, ...summaryData });
        setAvailable(availableData);
        setFull(fullData);
        setError('');
      } catch (requestError) {
        if (!active) return;
        setError(normalizeRegistrationError(requestError).message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReport();
    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.section
      className="dashboard"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="page-heading">
        <div>
          <p className="eyebrow">Panel general</p>
          <h1 data-reveal>{user?.name || user?.Name || 'Usuario'}, este es el estado de los eventos.</h1>
        </div>
        <Link className="secondary-button" to="/summary">
          <BarChart3 size={18} strokeWidth={1.8} />
          Ver resumen
        </Link>
      </div>

      {loading ? <div className="event-skeleton">Cargando resumen...</div> : null}
      {error ? (
        <div className="alert alert-error">
          <AlertCircle size={18} strokeWidth={1.8} />
          <p>{error}</p>
          <span />
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="metric-grid">
            <article className="metric-card">
              <TicketCheck size={24} strokeWidth={1.8} />
              <span>Eventos</span>
              <strong>{summary.totalEvents}</strong>
            </article>
            <article className="metric-card">
              <CalendarCheck size={24} strokeWidth={1.8} />
              <span>Inscripciones activas</span>
              <strong>{summary.totalActiveRegistrations}</strong>
            </article>
            <article className="metric-card">
              <CircleGauge size={24} strokeWidth={1.8} />
              <span>Ocupacion global</span>
              <strong>{summary.occupancyPercentage}%</strong>
            </article>
            <article className="metric-card">
              <BarChart3 size={24} strokeWidth={1.8} />
              <span>Cupos libres</span>
              <strong>{summary.availableSpots}</strong>
            </article>
          </div>

          <div className="dashboard-actions">
            <Link className="secondary-button" to="/availability">
              Disponibles: {available.length}
            </Link>
            <Link className="secondary-button" to="/full-events">
              Llenos: {full.length}
            </Link>
            <Link className="secondary-button" to="/registrations">
              Gestionar inscripciones
            </Link>
          </div>

          <section className="report-panel">
            <div className="section-title">
              <span>Avance por evento</span>
              <strong>
                {summary.totalActiveRegistrations}/{summary.totalCapacity} ocupados
              </strong>
            </div>
            {summary.events.length ? (
              <div className="report-list">
                {summary.events.slice(0, 6).map((event) => (
                  <EventProgress key={event.eventId} event={event} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>Sin eventos todavia</h2>
                <p>Cuando existan eventos publicados, el resumen de cupos aparecera aqui.</p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </motion.section>
  );
}
