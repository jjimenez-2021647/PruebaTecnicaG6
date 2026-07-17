import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button.jsx';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  isLoading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="confirm-dialog" role="dialog" aria-modal="true">
        <button className="modal-close" type="button" onClick={onCancel} aria-label="Cerrar">
          <X size={18} strokeWidth={1.8} />
        </button>
        <AlertTriangle size={24} strokeWidth={1.8} />
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <Button type="button" isLoading={isLoading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
