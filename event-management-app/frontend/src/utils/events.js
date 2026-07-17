export const EVENT_STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'active', label: 'Activo' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'completed', label: 'Finalizado' },
];

export function getStatusLabel(status) {
  return (
    EVENT_STATUS_OPTIONS.find((option) => option.value === status)?.label ||
    'Sin estado'
  );
}

export function formatEventDate(value) {
  if (!value) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function toDatetimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function fromDatetimeLocal(value) {
  return value ? new Date(value).toISOString() : '';
}
