import { AdminLayout } from './AdminLayout';
import { Outlet, useLocation } from 'react-router';

export function AdminPortalPage() {
  const { pathname } = useLocation();
  const isOverview = pathname === '/admin/developer/overview';

  return (
    <AdminLayout showWelcomeBanner={isOverview}>
      <Outlet />
    </AdminLayout>
  );
}

export function DeveloperSubpageLayout({ children, pageTitle }) {
  return (
    <AdminLayout workspace='developer' pageTitle={pageTitle}>
      {children}
    </AdminLayout>
  );
}
