import { Link, NavLink } from 'react-router-dom';
import { LogOut, PanelsTopLeft, Search, Ticket, UsersRound } from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';
import { useAuth } from '../hooks/useAuth.js';

export function AdminLayout({ children }) {
  const { logout, user } = useAuth();

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <BrandMark />
        <nav aria-label="Principal">
          <NavLink to="/dashboard">
            <PanelsTopLeft size={18} strokeWidth={1.8} />
            Dashboard
          </NavLink>
          <span className="nav-disabled">
            <Ticket size={18} strokeWidth={1.8} />
            Eventos
          </span>
          <span className="nav-disabled">
            <Search size={18} strokeWidth={1.8} />
            Busqueda
          </span>
          <span className="nav-disabled">
            <UsersRound size={18} strokeWidth={1.8} />
            Inscripciones
          </span>
        </nav>
        <button className="logout-button" type="button" onClick={logout}>
          <LogOut size={18} strokeWidth={1.8} />
          Cerrar sesion
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>Area administrativa</span>
            <strong>{user?.name || user?.Name || user?.username || 'Usuario'}</strong>
          </div>
          <Link to="/login" className="topbar-link">
            Cambiar cuenta
          </Link>
        </header>
        {children}
      </section>
    </main>
  );
}
