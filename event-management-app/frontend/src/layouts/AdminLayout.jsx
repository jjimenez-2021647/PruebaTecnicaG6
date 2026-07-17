import { Link, NavLink } from 'react-router-dom';
import {
  BarChart3,
  CircleGauge,
  ClipboardCheck,
  LogOut,
  PanelsTopLeft,
  Search,
  Ticket,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { isAdminRole } from '../utils/roles.js';

export function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const isAdmin = isAdminRole(user);

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <BrandMark />
        <nav aria-label="Principal">
          {isAdmin ? (
            <>
              <NavLink to="/admin/records">
                <ClipboardCheck size={18} strokeWidth={1.8} />
                Registros
              </NavLink>
              <NavLink to="/profile">
                <UserRound size={18} strokeWidth={1.8} />
                Perfil
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard">
                <PanelsTopLeft size={18} strokeWidth={1.8} />
                Dashboard
              </NavLink>
              <NavLink to="/events">
                <Ticket size={18} strokeWidth={1.8} />
                Eventos
              </NavLink>
              <NavLink to="/events/explore">
                <Search size={18} strokeWidth={1.8} />
                Busqueda
              </NavLink>
              <NavLink to="/registrations">
                <UsersRound size={18} strokeWidth={1.8} />
                Inscripciones
              </NavLink>
              <NavLink to="/availability">
                <ClipboardCheck size={18} strokeWidth={1.8} />
                Disponibles
              </NavLink>
              <NavLink to="/full-events">
                <CircleGauge size={18} strokeWidth={1.8} />
                Llenos
              </NavLink>
              <NavLink to="/summary">
                <BarChart3 size={18} strokeWidth={1.8} />
                Resumen
              </NavLink>
              <NavLink to="/profile">
                <UserRound size={18} strokeWidth={1.8} />
                Perfil
              </NavLink>
            </>
          )}
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
