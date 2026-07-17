import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export function Alert({ tone = 'error', message, details = [], onClose }) {
  if (!message) {
    return null;
  }

  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      <div>
        <p>{message}</p>
        {details.length ? (
          <ul>
            {details.map((detail) => (
              <li key={`${detail.field}-${detail.message}`}>
                {detail.field ? `${detail.field}: ` : ''}
                {detail.message}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {onClose ? (
        <button className="alert-close" type="button" onClick={onClose} aria-label="Cerrar">
          <X size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
