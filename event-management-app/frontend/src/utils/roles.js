export const ADMIN_ROLE = 'ADMIN_ROLE';
export const USER_ROLE = 'USER_ROLE';
export const adminOnly = [ADMIN_ROLE];
export const userOnly = [USER_ROLE];

export function getUserRole(user) {
  return user?.role || user?.Role || user?.roleName || user?.RoleName || USER_ROLE;
}

export function isAdminRole(user) {
  return getUserRole(user) === ADMIN_ROLE;
}

export function getHomePathForUser(user) {
  return isAdminRole(user) ? '/admin/records' : '/dashboard';
}
