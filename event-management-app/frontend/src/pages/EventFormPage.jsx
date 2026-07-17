import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Camera, Image, MapPin, Text, Users } from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import {
  createEventRequest,
  getEventRequest,
  normalizeEventError,
  updateEventRequest,
} from '../api/eventsApi.js';
import { EVENT_STATUS_OPTIONS, fromDatetimeLocal, toDatetimeLocal } from '../utils/events.js';

const initialValues = {
  name: '',
  date: '',
  place: '',
  capacity: '',
  description: '',
  status: 'active',
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (!values.date) errors.date = 'La fecha es obligatoria.';
  if (!values.place.trim()) errors.place = 'El lugar es obligatorio.';
  if (!Number.isInteger(Number(values.capacity)) || Number(values.capacity) <= 0) {
    errors.capacity = 'La capacidad debe ser mayor que cero.';
  }

  return errors;
}

export function EventFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const title = useMemo(
    () => (isEditing ? 'Editar evento' : 'Crear evento'),
    [isEditing]
  );

  useEffect(() => {
    if (!isEditing) return;

    getEventRequest(id)
      .then((event) => {
        setValues({
          name: event.name || '',
          date: toDatetimeLocal(event.date),
          place: event.place || '',
          capacity: String(event.capacity || ''),
          description: event.description || '',
          status: event.status || 'active',
        });
        setImagePreview(event.imageUrl || '');
      })
      .catch((requestError) => setServerError(normalizeEventError(requestError)))
      .finally(() => setIsLoading(false));
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  useEffect(() => {
    if (!imageFile) return undefined;
    const nextPreview = URL.createObjectURL(imageFile);
    setImagePreview(nextPreview);
    return () => URL.revokeObjectURL(nextPreview);
  }, [imageFile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setServerError(null);

    if (Object.keys(nextErrors).length) return;

    const payload = {
      name: values.name.trim(),
      date: fromDatetimeLocal(values.date),
      place: values.place.trim(),
      capacity: Number(values.capacity),
      description: values.description.trim(),
      status: values.status,
      eventImage: imageFile,
    };

    setIsSaving(true);

    try {
      const savedEvent = isEditing
        ? await updateEventRequest(id, payload)
        : await createEventRequest(payload);
      navigate(`/events/${savedEvent.id}`, { replace: true });
    } catch (requestError) {
      setServerError(normalizeEventError(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="events-page">
      <Link className="quiet-link" to="/events">
        <ArrowLeft size={16} strokeWidth={1.8} />
        Volver a eventos
      </Link>

      <header className="page-heading compact">
        <div>
          <p className="eyebrow">Eventos</p>
          <h1>{title}</h1>
        </div>
      </header>

      <Alert
        tone="error"
        message={serverError?.message}
        details={serverError?.errors || []}
      />

      {isLoading ? (
        <div className="event-skeleton">Cargando evento</div>
      ) : (
        <form className="event-form" onSubmit={handleSubmit} noValidate>
          <Field
            id="name"
            name="name"
            label="Nombre"
            icon={Text}
            value={values.name}
            onChange={handleChange}
            error={errors.name}
          />
          <div className="field-grid">
            <Field
              id="date"
              name="date"
              label="Fecha"
              icon={CalendarDays}
              type="datetime-local"
              value={values.date}
              onChange={handleChange}
              error={errors.date}
            />
            <Field
              id="capacity"
              name="capacity"
              label="Capacidad"
              icon={Users}
              type="number"
              min="1"
              value={values.capacity}
              onChange={handleChange}
              error={errors.capacity}
            />
          </div>
          <Field
            id="place"
            name="place"
            label="Lugar"
            icon={MapPin}
            value={values.place}
            onChange={handleChange}
            error={errors.place}
          />
          <label className="select-field" htmlFor="status">
            <span>Estado</span>
            <select id="status" name="status" value={values.status} onChange={handleChange}>
              {EVENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="textarea-field" htmlFor="description">
            <span>Descripcion</span>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={values.description}
              onChange={handleChange}
            />
          </label>
          <section className="event-image-field">
            <div className="event-image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa del evento" />
              ) : (
                <div>
                  <Image size={40} strokeWidth={1.5} />
                  <span>Sin imagen seleccionada</span>
                </div>
              )}
            </div>
            <label className="file-picker" htmlFor="eventImage">
              <Camera size={20} strokeWidth={1.8} />
              <span>{imageFile?.name || 'Seleccionar imagen del evento'}</span>
              <input
                id="eventImage"
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              />
            </label>
          </section>
          <Button type="submit" isLoading={isSaving}>
            Guardar evento
          </Button>
        </form>
      )}
    </section>
  );
}
