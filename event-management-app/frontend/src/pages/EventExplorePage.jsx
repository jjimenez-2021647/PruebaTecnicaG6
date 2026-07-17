import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { EventStatusBadge } from '../components/EventStatusBadge.jsx';
import { searchEventsRequest, normalizeEventError } from '../api/eventsApi.js';
import { EVENT_STATUS_OPTIONS, formatEventDate } from '../utils/events.js';

export function EventExplorePage() {
  const [params, setParams] = useSearchParams();
  const [draftSearch, setDraftSearch] = useState(params.get('search') || '');
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    date: params.get('date') || '',
    place: params.get('place') || '',
    status: params.get('status') || '',
    sortBy: params.get('sortBy') || 'date',
    order: params.get('order') || 'asc',
    page: Number(params.get('page') || 1),
    limit: 9,
  });
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => ({ ...current, search: draftSearch, page: 1 }));
    }, 350);

    return () => clearTimeout(timer);
  }, [draftSearch]);

  const queryObject = useMemo(() => {
    const clean = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) clean[key] = value;
    });
    return clean;
  }, [filters]);

  useEffect(() => {
    setParams(queryObject, { replace: true });
    setIsLoading(true);
    setError(null);

    searchEventsRequest(queryObject)
      .then((response) => {
        setEvents(response.events);
        setPagination(response.pagination);
      })
      .catch((requestError) => setError(normalizeEventError(requestError)))
      .finally(() => setIsLoading(false));
  }, [queryObject, setParams]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setDraftSearch('');
    setFilters({
      search: '',
      date: '',
      place: '',
      status: '',
      sortBy: 'date',
      order: 'asc',
      page: 1,
      limit: 9,
    });
  };

  return (
    <section className="events-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Exploracion</p>
          <h1>Buscar eventos</h1>
        </div>
      </header>

      <div className="filter-panel">
        <label className="filter-input">
          <Search size={18} strokeWidth={1.8} />
          <input
            value={draftSearch}
            onChange={(event) => setDraftSearch(event.target.value)}
            placeholder="Buscar por nombre"
          />
        </label>
        <input
          className="plain-input"
          type="date"
          value={filters.date}
          onChange={(event) => updateFilter('date', event.target.value)}
        />
        <input
          className="plain-input"
          value={filters.place}
          onChange={(event) => updateFilter('place', event.target.value)}
          placeholder="Lugar"
        />
        <select
          className="plain-input"
          value={filters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
        >
          <option value="">Todos</option>
          {EVENT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="plain-input"
          value={filters.sortBy}
          onChange={(event) => updateFilter('sortBy', event.target.value)}
        >
          <option value="date">Fecha</option>
          <option value="name">Nombre</option>
          <option value="place">Lugar</option>
          <option value="capacity">Capacidad</option>
          <option value="status">Estado</option>
        </select>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            setFilters((current) => ({
              ...current,
              order: current.order === 'asc' ? 'desc' : 'asc',
              page: 1,
            }))
          }
        >
          <SlidersHorizontal size={18} strokeWidth={1.8} />
          {filters.order === 'asc' ? 'Asc' : 'Desc'}
        </button>
        <button className="secondary-button" type="button" onClick={clearFilters}>
          <X size={18} strokeWidth={1.8} />
          Limpiar
        </button>
      </div>

      <Alert tone="error" message={error?.message} details={error?.errors || []} />

      {isLoading ? <div className="event-skeleton">Buscando eventos</div> : null}

      {!isLoading && !events.length ? (
        <div className="empty-state">
          <h2>Sin resultados.</h2>
          <p>Ajusta la busqueda o limpia filtros para volver al listado general.</p>
        </div>
      ) : null}

      <div className="explore-grid">
        {events.map((event) => (
          <Link className="explore-card" key={event.id} to={`/events/${event.id}`}>
            <span>{formatEventDate(event.date)}</span>
            <h2>{event.name}</h2>
            <p>{event.place}</p>
            <div>
              <EventStatusBadge status={event.status} />
              <strong>{event.capacity} cupos</strong>
            </div>
          </Link>
        ))}
      </div>

      {pagination?.totalPages > 1 ? (
        <div className="pagination-bar">
          <button
            className="secondary-button"
            type="button"
            disabled={filters.page <= 1}
            onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
          >
            Anterior
          </button>
          <span>
            Pagina {pagination.page} de {pagination.totalPages}
          </span>
          <button
            className="secondary-button"
            type="button"
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </section>
  );
}
