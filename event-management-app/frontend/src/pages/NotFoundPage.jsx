import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Esta ruta todavia no existe.</h1>
      <Link className="quiet-link" to="/dashboard">
        <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
        Volver al panel
      </Link>
    </main>
  );
}
