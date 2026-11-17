import { Navigate, Outlet } from 'react-router';
import { useAuth } from './useAuth';
import { adminLandingRoutes } from './authRoutes';

export function RequireRole({ roles, excludeRoles = [], children }) {
  const { admin } = useAuth();
  if ((roles && !roles.includes(admin?.role)) || excludeRoles.includes(admin?.role)) {
    return <Navigate to={adminLandingRoutes[admin?.role] || '/login'} replace />;
  }
  return children || <Outlet />;
}
