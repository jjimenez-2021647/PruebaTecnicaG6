import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';

export function AuthLayout({ eyebrow, title, copy, children, aside }) {
  return (
    <main className="auth-shell">
      <section className="auth-stage">
        <div className="auth-rail" aria-hidden="true">
          <span>JWT</span>
          <span>PostgreSQL</span>
          <span>Grupo 6</span>
        </div>

        <motion.div
          className="auth-copy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <BrandMark />
          <p className="eyebrow">{eyebrow}</p>
          <h1 data-reveal>{title}</h1>
          <p className="auth-lead">{copy}</p>
          <div className="auth-proof">
            <ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" />
            <span>Token firmado por AuthService y enviado como Bearer.</span>
          </div>
        </motion.div>

        <motion.section
          className="auth-panel"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.section>

        <aside className="auth-aside">
          {aside}
          <Link className="quiet-link" to="/dashboard">
            Entrar al panel
            <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </aside>
      </section>
    </main>
  );
}
