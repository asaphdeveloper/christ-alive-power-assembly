import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './useAuth';

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className='route-loading' aria-busy='true'>
        <span className='sr-only'>Checking your session…</span>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
}
