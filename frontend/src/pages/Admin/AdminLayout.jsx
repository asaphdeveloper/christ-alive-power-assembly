import { useState } from 'react';
import {
  ExternalLink,
  Landmark,
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
  {
    label: 'Branch finance secretary',
    to: '/admin/branch-finance-secretary',
    icon: Landmark,
  },
  {
    label: 'Headquater media admin',
    to: '/admin/headquater-media-admin',
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
  { label: 'Media resources', to: '/admin/branch-media-admin', icon: LayoutDashboard },
  { label: 'Developer workspace', to: '/admin/developer', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const branchFinanceSecretaryNavItems = [
  { label: 'Overview', to: '/admin/branch-finance-secretary', icon: LayoutDashboard },
  { label: 'Developer workspace', to: '/admin/developer', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const headquaterMediaAdminNavItems = [
  { label: 'Media resources', to: '/admin/headquater-media-admin', icon: LayoutDashboard },
  { label: 'Developer workspace', to: '/admin/developer', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const workspaces = {
  developer: {
    navItems: developerNavItems,
    homeTo: '/admin/developer',
    profileName: 'Developer',
  },
  'general-overseer': {
    navItems: generalOverseerNavItems,
    homeTo: '/admin/general-overseer',
    profileName: 'General Overseer',
  },
  'branch-media-admin': {
    navItems: branchMediaAdminNavItems,
    homeTo: '/admin/branch-media-admin',
    profileName: 'Branch Media Admin',
  },
  'branch-finance-secretary': {
    navItems: branchFinanceSecretaryNavItems,
    homeTo: '/admin/branch-finance-secretary',
    profileName: 'Branch Finance Secretary',
  },
  'headquater-media-admin': {
    navItems: headquaterMediaAdminNavItems,
    homeTo: '/admin/headquater-media-admin',
    profileName: 'Headquater Media Admin',
  },
};

export function AdminLayout({
  children,
  workspace = 'developer',
  pageTitle = 'Admins',
}) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { navItems, homeTo, profileName } = workspaces[workspace] ?? workspaces.developer;
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
