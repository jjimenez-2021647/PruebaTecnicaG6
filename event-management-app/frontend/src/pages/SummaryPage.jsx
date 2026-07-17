import { motion } from 'framer-motion';
import { AlertCircle, BarChart3, CircleGauge, TicketCheck, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSummaryRequest, normalizeRegistrationError } from '../api/registrationsApi.js';

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

export function SummaryPage() {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        setLoading(true);
        const data = await getSummaryRequest();
        if (!active) return;
        setSummary({ ...initialSummary, ...data });
        setError('');
      } catch (requestError) {
        if (!active) return;
        setError(normalizeRegistrationError(requestError).message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

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
          <p className="eyebrow">Resumen</p>
          <h1>Ocupacion y cupos del sistema</h1>
        </div>
        <BarChart3 size={34} strokeWidth={1.5} />
      </div>

      {loading ? <div className="event-skeleton">Calculando resumen...</div> : null}
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
              <span>Eventos totales</span>
              <strong>{summary.totalEvents}</strong>
            </article>
            <article className="metric-card">
              <UsersRound size={24} strokeWidth={1.8} />
              <span>Inscripciones activas</span>
              <strong>{summary.totalActiveRegistrations}</strong>
            </article>
            <article className="metric-card">
              <CircleGauge size={24} strokeWidth={1.8} />
              <span>Ocupacion</span>
              <strong>{summary.occupancyPercentage}%</strong>
            </article>
            <article className="metric-card">
              <BarChart3 size={24} strokeWidth={1.8} />
              <span>Canceladas</span>
              <strong>{summary.totalCancelledRegistrations}</strong>
            </article>
          </div>

          <section className="report-panel">
            <div className="section-title">
              <span>Detalle completo</span>
              <strong>{summary.availableSpots} cupos libres</strong>
            </div>
            {summary.events.length ? (
              <div className="events-table summary-table">
                <div className="events-row events-head summary-row">
                  <span>Evento</span>
                  <span>Lugar</span>
                  <span>Capacidad</span>
                  <span>Inscritos</span>
                  <span>Libres</span>
                  <span>Estado</span>
                </div>
                {summary.events.map((event) => (
                  <div className="events-row summary-row" key={event.eventId}>
                    <strong>{event.name}</strong>
                    <span>{event.place}</span>
                    <span>{event.capacity}</span>
                    <span>{event.registered}</span>
                    <span>{event.available}</span>
                    <span
                      className={
                        event.status === 'FULL'
                          ? 'status-badge status-cancelled'
                          : 'status-badge status-active'
                      }
                    >
                      {event.status === 'FULL' ? 'Lleno' : 'Disponible'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>Sin datos de eventos</h2>
                <p>El resumen se llenara cuando service-events devuelva eventos.</p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </motion.section>
  );
}
