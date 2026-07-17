import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getHomePathForUser, getUserRole, USER_ROLE } from '../utils/roles.js';

export function RoleRoute({ allow = [USER_ROLE], children }) {
  const { user } = useAuth();
  const role = getUserRole(user);

  if (!allow.includes(role)) {
    return <Navigate to={getHomePathForUser(user)} replace />;
  }

  return children;
}

export function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomePathForUser(user)} replace />;
}
