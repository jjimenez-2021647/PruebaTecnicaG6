import { getStatusLabel } from '../utils/events.js';

export function EventStatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{getStatusLabel(status)}</span>;
}
