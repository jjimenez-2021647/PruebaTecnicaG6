import { CalendarRange } from 'lucide-react';
import { APP_LOGO_IMAGE, APP_LOGO_IMAGE_ALT } from '../utils/assets.js';

export function BrandMark() {
  return (
    <div className="brand-mark" aria-label="Event Management">
      <span className="brand-icon">
        <img
          src={APP_LOGO_IMAGE}
          alt=""
          aria-hidden="true"
          onError={(event) => {
            if (event.currentTarget.src !== new URL(APP_LOGO_IMAGE_ALT, window.location.origin).href) {
              event.currentTarget.src = APP_LOGO_IMAGE_ALT;
              return;
            }
            event.currentTarget.style.display = 'none';
            event.currentTarget.nextElementSibling.style.display = 'block';
          }}
        />
        <CalendarRange
          className="brand-icon-fallback"
          size={22}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>
      <span>
        <strong>Event</strong>
        <small>Management</small>
      </span>
    </div>
  );
}
