import { AdminLayout } from './AdminLayout';
import { Outlet } from 'react-router';

export function AdminPortalPage() {
  return <AdminLayout><Outlet /></AdminLayout>;
}
