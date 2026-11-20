import { useState } from 'react';
import {
  ClipboardCheck,
  ClipboardList,
  Clapperboard,
  Church,
  ExternalLink,
  LayoutDashboard,
  MapPin,
  MapPinned,
  Settings,
  Users,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import './AdminLayout.css';

const developerNavItems = [
  { label: 'Overview', to: '/admin/developer/overview', icon: LayoutDashboard },
  { label: 'Administrators', to: '/admin/all-admins', icon: Users },
  { label: 'Branches', to: '/admin/branches', icon: MapPinned },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const generalOverseerNavItems = [
  { label: 'Overview', to: '/admin/general-overseer', icon: LayoutDashboard },
  {
    label: 'Attendance overview',
    to: '/admin/attendance-overview',
    icon: ClipboardCheck,
  },
  {
    label: 'Attendance reports',
    to: '/admin/attendance-reports',
    icon: ClipboardList,
  },
  {
    label: 'Upload resources',
    to: '/admin/upload-resource',
    icon: Clapperboard,
  },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const branchMediaAdminNavItems = [
  { label: 'Overview', to: '/admin/branch-media-admin', icon: LayoutDashboard },
  {
    label: 'Attendance',
    to: '/admin/branch-media-admin/attendance',
    icon: ClipboardCheck,
  },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const headquaterMediaAdminNavItems = [
  {
    label: 'Overview',
    to: '/admin/headquater-media-admin/overview',
    icon: LayoutDashboard,
  },
  {
    label: 'Attendance overview',
    to: '/admin/attendance-overview',
    icon: ClipboardCheck,
  },
  {
    label: 'Attendance reports',
    to: '/admin/attendance-reports',
    icon: ClipboardList,
  },
  {
    label: 'Upload resources',
    to: '/admin/upload-resource',
    icon: Clapperboard,
  },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const workspaces = {
  developer: {
    navItems: developerNavItems,
    homeTo: '/admin/developer/overview',
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
    brandName: 'CAPA BAUCHI',
  },
  'headquater-media-admin': {
    navItems: headquaterMediaAdminNavItems,
    homeTo: '/admin/headquater-media-admin/overview',
    profileName: 'Headquater Media Admin',
  },
};

const welcomeDetails = {
  developer: {
    kicker: 'CAPA ADMINISTRATION',
    title: 'Welcome to the Developer Workspace',
    description:
      'Manage church administrators, branch records, and workspace access from one place.',
    facts: ['Church-wide administration', 'Branch and account management'],
    icon: Settings,
  },
  'general-overseer': {
    kicker: 'LEADERSHIP WORKSPACE',
    title: 'Welcome, General Overseer',
    description: 'Review church activity and stay connected with every branch.',
    facts: ['All church branches', 'Attendance and finance summaries'],
    icon: Church,
  },
  'branch-media-admin': {
    kicker: 'BRANCH MEDIA WORKSPACE',
    title: 'Welcome to your branch workspace',
    description: 'Manage attendance and media activity for your assigned branch.',
    facts: ['Your assigned branch', 'Manage your local branch'],
    icon: Clapperboard,
  },
  'headquater-media-admin': {
    kicker: 'HEADQUARTER MEDIA WORKSPACE',
    title: 'Welcome to Headquarter Media',
    description:
      'Manage media and service resources for the wider church community.',
    facts: ['Headquarter Branch', 'Church-wide resources'],
    icon: Clapperboard,
  },
};

function AdminWelcomeBanner({ workspace, branchName }) {
  const details = welcomeDetails[workspace];
  if (!details) return null;
  const Icon = details.icon;
  const isBranchWorkspace = workspace === 'branch-media-admin';

  return (
    <section
      className='branch-media-welcome'
      aria-label={`${details.title} welcome`}
    >
      <div className='branch-media-welcome-content'>
        <span className='branch-media-welcome-kicker'>{details.kicker}</span>
        <h1>{isBranchWorkspace ? `Welcome to ${branchName}` : details.title}</h1>
        <p>{details.description}</p>
        <div className='branch-media-welcome-facts'>
          <span>
            <MapPin size={15} aria-hidden='true' />
            {isBranchWorkspace ? branchName : details.facts[0]}
          </span>
          <span>
            <ClipboardList size={15} aria-hidden='true' />
            {details.facts[1]}
          </span>
        </div>
      </div>
      <div className='branch-media-welcome-mark' aria-hidden='true'>
        <Icon size={34} />
      </div>
    </section>
  );
}

export function AdminLayout({
  children,
  workspace = 'developer',
  pageTitle = 'Admins',
  showWelcomeBanner = false,
}) {
  const { pathname } = useLocation();
  const { admin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const {
    navItems,
    homeTo,
    profileName,
    brandName = 'CAPA BAUCHI',
  } = workspaces[workspace] ?? workspaces.developer;
  const currentPage =
    navItems.find((item) => item.to === pathname)?.label ?? pageTitle;
  const branchName = admin?.branch?.name ?? 'your assigned branch';
  const isBranchWorkspace = workspace === 'branch-media-admin';
  const branchLabel = admin?.branch?.name?.replace(/\s+branch$/i, '').trim();
  const workspaceProfileName = isBranchWorkspace
    ? admin?.name ?? profileName
    : profileName;
  const workspaceAccountName = isBranchWorkspace
    ? admin?.name ?? profileName
    : profileName;
  const workspaceBrandName = isBranchWorkspace && branchLabel
    ? `CAPA ${branchLabel.toLocaleUpperCase()}`
    : brandName;

  return (
    <div className={`admin-shell${collapsed ? ' is-collapsed' : ''}`}>
      <AdminSidebar
        navItems={navItems}
        homeTo={homeTo}
        homeLabel={`${profileName} workspace home`}
        brandName={workspaceBrandName}
        navigationLabel={`${profileName} workspace navigation`}
        profileName={workspaceProfileName}
        workspace={workspace}
        profileDescription={isBranchWorkspace ? admin?.username ?? '' : 'Workspace access'}
        collapsed={collapsed}
      />
      <main className='admin-main' id='main-content' tabIndex={-1}>
        <AdminHeader
          workspaceName={workspaceAccountName}
          currentPage={currentPage}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
        />
        {showWelcomeBanner && <AdminWelcomeBanner workspace={workspace} branchName={branchName} />}
        {children}
      </main>
    </div>
  );
}
