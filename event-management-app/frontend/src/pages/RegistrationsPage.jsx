import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, UserRound, Users } from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { Field } from '../components/Field.jsx';
import { listEventsRequest } from '../api/eventsApi.js';
import {
  cancelRegistrationRequest,
  createRegistrationRequest,
  getAttendeesRequest,
  normalizeRegistrationError,
} from '../api/registrationsApi.js';

const initialValues = { attendeeName: '', attendeeEmail: '', attendeePhone: '' };

export function RegistrationsPage() {
  const { id: routeEventId } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(routeEventId || '');
  const [attendees, setAttendees] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId]
  );
  const activeCount = attendees.filter((item) => item.status === 'active').length;
  const available = selectedEvent ? Math.max(selectedEvent.capacity - activeCount, 0) : 0;

  useEffect(() => {
    listEventsRequest()
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        if (!routeEventId && Array.isArray(data) && data[0]) setSelectedEventId(data[0].id);
      })
      .catch((requestError) => setError(normalizeRegistrationError(requestError)))
      .finally(() => setIsLoading(false));
  }, [routeEventId]);

  useEffect(() => {
    if (!selectedEventId) return;
    getAttendeesRequest(selectedEventId)
      .then((response) => setAttendees(response.attendees))
      .catch((requestError) => setError(normalizeRegistrationError(requestError)));
  }, [selectedEventId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!selectedEventId || !values.attendeeName.trim() || !values.attendeeEmail.includes('@')) {
      setError({ message: 'Selecciona evento, nombre y correo valido.' });
      return;
    }

    setIsSaving(true);
    try {
      await createRegistrationRequest({ eventId: selectedEventId, ...values });
      const response = await getAttendeesRequest(selectedEventId);
      setAttendees(response.attendees);
      setValues(initialValues);
      setNotice('Asistente registrado correctamente.');
    } catch (requestError) {
      setError(normalizeRegistrationError(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setIsSaving(true);
    try {
      await cancelRegistrationRequest(cancelTarget.id);
      const response = await getAttendeesRequest(selectedEventId);
      setAttendees(response.attendees);
      setNotice('Inscripcion cancelada correctamente.');
      setCancelTarget(null);
    } catch (requestError) {
      setError(normalizeRegistrationError(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="events-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Inscripciones</p>
          <h1>Gestion de asistentes</h1>
        </div>
      </header>

      <Alert tone="success" message={notice} onClose={() => setNotice(null)} />
      <Alert tone="error" message={error?.message} details={error?.errors || []} />

      {isLoading ? <div className="event-skeleton">Cargando eventos</div> : null}

      <div className="registration-layout">
        <form className="event-form" onSubmit={handleSubmit} noValidate>
          <label className="select-field" htmlFor="eventId">
            <span>Evento</span>
            <select
              id="eventId"
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </label>
          <div className="capacity-strip">
            <span><Users size={18} strokeWidth={1.8} /> Capacidad: {selectedEvent?.capacity || 0}</span>
            <span>Ocupados: {activeCount}</span>
            <span>Restantes: {available}</span>
          </div>
          <Field id="attendeeName" name="attendeeName" label="Nombre" icon={UserRound} value={values.attendeeName} onChange={handleChange} />
          <Field id="attendeeEmail" name="attendeeEmail" label="Correo" icon={Mail} value={values.attendeeEmail} onChange={handleChange} />
          <Field id="attendeePhone" name="attendeePhone" label="Telefono opcional" icon={Phone} value={values.attendeePhone} onChange={handleChange} />
          <Button type="submit" disabled={!available} isLoading={isSaving}>
            Registrar asistente
          </Button>
        </form>

        <div className="attendee-list">
          {attendees.map((attendee) => (
            <article key={attendee.id}>
              <div>
                <strong>{attendee.attendeeName}</strong>
                <span>{attendee.attendeeEmail}</span>
              </div>
              <span className={`status-badge status-${attendee.status}`}>{attendee.status}</span>
              {attendee.status === 'active' ? (
                <button className="secondary-button danger" type="button" onClick={() => setCancelTarget(attendee)}>
                  Cancelar
                </button>
              ) : null}
            </article>
          ))}
          {!attendees.length ? <div className="empty-state">No hay asistentes para este evento.</div> : null}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancelar inscripcion"
        message={`Se cancelara la inscripcion de ${cancelTarget?.attendeeName}.`}
        confirmLabel="Cancelar"
        isLoading={isSaving}
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </section>
  );
}
