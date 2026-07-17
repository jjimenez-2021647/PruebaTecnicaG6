import { motion } from 'framer-motion';
import { CalendarPlus, LockKeyhole, RadioTower } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <motion.section
      className="dashboard"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="eyebrow">Sesion activa</p>
      <h1 data-reveal>
        {user?.name || user?.Name || 'Usuario'}, tu token ya esta listo para los
        siguientes servicios.
      </h1>

      <div className="status-grid">
        <article>
          <LockKeyhole size={24} strokeWidth={1.8} />
          <span>AuthService</span>
          <strong>Conectado por Bearer JWT</strong>
        </article>
        <article>
          <RadioTower size={24} strokeWidth={1.8} />
          <span>Eventos</span>
          <strong>Pendiente para Integrante 2</strong>
        </article>
        <article>
          <CalendarPlus size={24} strokeWidth={1.8} />
          <span>Inscripciones</span>
          <strong>Pendiente para Integrante 4</strong>
        </article>
      </div>
    </motion.section>
  );
}
