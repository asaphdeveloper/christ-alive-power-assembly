import { useState } from 'react';
import {
  ExternalLink,
  LayoutDashboard,
  MapPinned,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import './AdminLayout.css';

const developerNavItems = [
  { label: 'Administrators', to: '/admin/developer/admins', icon: Users },
  { label: 'Branches', to: '/admin/developer/branches', icon: MapPinned },
  {
    label: 'General overseer',
    to: '/admin/general-overseer',
    icon: LayoutDashboard,
  },
  {
    label: 'Branch media admin',
    to: '/admin/branch-media-admin',
    icon: Video,
  },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const generalOverseerNavItems = [
  { label: 'Overview', to: '/admin/general-overseer', icon: LayoutDashboard },
  { label: 'Developer workspace', to: '/admin/developer', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const branchMediaAdminNavItems = [
  { label: 'Overview', to: '/admin/branch-media-admin', icon: LayoutDashboard },
  { label: 'Developer workspace', to: '/admin/developer', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

export function AdminLayout({
  children,
  workspace = 'developer',
  pageTitle = 'Admins',
}) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isGeneralOverseer = workspace === 'general-overseer';
  const isBranchMediaAdmin = workspace === 'branch-media-admin';
  const navItems = isGeneralOverseer
    ? generalOverseerNavItems
    : isBranchMediaAdmin
      ? branchMediaAdminNavItems
      : developerNavItems;
  const homeTo = isGeneralOverseer
    ? '/admin/general-overseer'
    : isBranchMediaAdmin
      ? '/admin/branch-media-admin'
      : '/admin/developer';
  const profileName = isGeneralOverseer
    ? 'General Overseer'
    : isBranchMediaAdmin
      ? 'Branch Media Admin'
      : 'Developer';
  const currentPage =
    navItems.find((item) => item.to === pathname)?.label ?? pageTitle;

  return (
    <div className={`admin-shell${collapsed ? ' is-collapsed' : ''}`}>
      <AdminSidebar
        navItems={navItems}
        homeTo={homeTo}
        homeLabel={`${profileName} workspace home`}
        navigationLabel={`${profileName} workspace navigation`}
        profileName={profileName}
        profileDescription='Workspace access'
        collapsed={collapsed}
      />
      <main className='admin-main' id='main-content' tabIndex={-1}>
        <AdminHeader
          workspaceName={profileName}
          currentPage={currentPage}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
        />
        {children}
      </main>
    </div>
  );
}
