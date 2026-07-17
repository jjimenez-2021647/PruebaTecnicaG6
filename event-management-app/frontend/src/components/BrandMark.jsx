import { CalendarRange } from 'lucide-react';

export function BrandMark() {
  return (
    <div className="brand-mark" aria-label="Event Management">
      <span className="brand-icon">
        <CalendarRange size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span>
        <strong>Event</strong>
        <small>Management</small>
      </span>
    </div>
  );
}
