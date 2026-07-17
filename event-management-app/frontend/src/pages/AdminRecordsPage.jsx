import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { listEventsRequest } from '../api/eventsApi.js';
import {
  listRegistrationsRequest,
  normalizeRegistrationError,
} from '../api/registrationsApi.js';

function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-GT');
}

export function AdminRecordsPage() {
  const [events, setEvents] = useState([]);
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const eventsById = useMemo(() => {
    const map = new Map();
    events.forEach((event) => map.set(event.id, event));
    return map;
  }, [events]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();

    return records.filter((record) => {
      const event = eventsById.get(record.eventId);
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const text = [
        record.attendeeName,
        record.attendeeEmail,
        record.attendeePhone,
        event?.name,
        event?.place,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesStatus && (!term || text.includes(term));
    });
  }, [eventsById, records, search, statusFilter]);

  const groupedEvents = useMemo(() => {
    const groups = new Map();

    events.forEach((event) => {
      groups.set(event.id, { event, records: [] });
    });

    filteredRecords.forEach((record) => {
      const event = eventsById.get(record.eventId);
      const fallbackEvent = {
        id: record.eventId,
        name: 'Evento no encontrado',
        date: null,
        place: record.eventId,
        capacity: 0,
      };
      const key = event?.id || record.eventId;
      const group = groups.get(key) || { event: event || fallbackEvent, records: [] };

      group.records.push(record);
      groups.set(key, group);
    });

    return Array.from(groups.values())
      .filter((group) => group.records.length)
      .sort((first, second) => new Date(first.event.date || 0) - new Date(second.event.date || 0));
  }, [events, eventsById, filteredRecords]);

  useEffect(() => {
    let active = true;

    async function loadRecords() {
      try {
        setIsLoading(true);
        const [eventsData, recordsData] = await Promise.all([
          listEventsRequest({ limit: 50 }),
          listRegistrationsRequest(),
        ]);

        if (!active) return;
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setRecords(Array.isArray(recordsData) ? recordsData : []);
        setError(null);
      } catch (requestError) {
        if (!active) return;
        setError(normalizeRegistrationError(requestError));
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadRecords();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="events-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Vista administrador</p>
          <h1>Registros del sistema</h1>
        </div>
        <ClipboardList size={34} strokeWidth={1.5} />
      </header>

      <Alert tone="error" message={error?.message} details={error?.errors || []} />

      <div className="filter-panel admin-record-filters">
        <label className="filter-input" htmlFor="recordSearch">
          <UserRound size={18} strokeWidth={1.8} />
          <input
            id="recordSearch"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar registro"
          />
        </label>
        <label className="select-field" htmlFor="statusFilter">
          <span>Estado</span>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </label>
        <div className="capacity-strip admin-record-summary">
          <span>Total: {records.length}</span>
          <span>Activos: {records.filter((record) => record.status === 'active').length}</span>
          <span>Cancelados: {records.filter((record) => record.status === 'cancelled').length}</span>
        </div>
      </div>

      {isLoading ? <div className="event-skeleton">Cargando registros</div> : null}

      {!isLoading && !groupedEvents.length ? (
        <div className="empty-state">
          <AlertCircle size={22} strokeWidth={1.8} />
          <h2>No hay registros para mostrar</h2>
          <p>Cuando existan inscripciones, el admin las vera aqui sin acciones de edicion.</p>
        </div>
      ) : null}

      {!isLoading && groupedEvents.length ? (
        <div className="admin-event-list">
          {groupedEvents.map(({ event, records: eventRecords }) => {
            const activeCount = eventRecords.filter((record) => record.status === 'active').length;
            const cancelledCount = eventRecords.filter((record) => record.status === 'cancelled').length;

            return (
              <article className="admin-event-group" key={event.id}>
                <button
                  className="admin-event-head"
                  type="button"
                  aria-expanded={expandedEventId === event.id}
                  onClick={() =>
                    setExpandedEventId((current) => (current === event.id ? null : event.id))
                  }
                >
                  <div>
                    <strong>{event.name}</strong>
                    <span>
                      <MapPin size={16} strokeWidth={1.8} />
                      {event.place}
                    </span>
                    <span>
                      <CalendarDays size={16} strokeWidth={1.8} />
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="admin-event-stats">
                    <span>
                      <UsersRound size={16} strokeWidth={1.8} />
                      {eventRecords.length} participantes
                    </span>
                    <span>Activos: {activeCount}</span>
                    <span>Cancelados: {cancelledCount}</span>
                  </div>
                  <ChevronDown
                    className="admin-event-chevron"
                    size={22}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>

                {expandedEventId === event.id ? (
                  <div className="admin-participant-list">
                    {eventRecords.map((record) => (
                      <section className="admin-record-card" key={record.id}>
                        <div>
                          <strong>{record.attendeeName}</strong>
                          <span>
                            <Mail size={16} strokeWidth={1.8} />
                            {record.attendeeEmail}
                          </span>
                          {record.attendeePhone ? (
                            <span>
                              <Phone size={16} strokeWidth={1.8} />
                              {record.attendeePhone}
                            </span>
                          ) : null}
                        </div>
                        <span className={`status-badge status-${record.status}`}>
                          {record.status}
                        </span>
                      </section>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
