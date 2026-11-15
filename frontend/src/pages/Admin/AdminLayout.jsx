import { useState } from 'react';
import {
  ClipboardCheck,
  CircleDollarSign,
  Clapperboard,
  Church,
  ClipboardList,
  ExternalLink,
  Landmark,
  LayoutDashboard,
  MapPin,
  MapPinned,
  Settings,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import './AdminLayout.css';

const developerNavItems = [
  { label: 'Overview', to: '/admin/developer/overview', icon: LayoutDashboard },
  { label: 'Administrators', to: '/admin/all-admins', icon: Users },
  { label: 'Branches', to: '/admin/branches', icon: MapPinned },
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
    to: '/admin/headquater-media-admin/overview',
    icon: Video,
  },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const generalOverseerNavItems = [
  { label: 'Overview', to: '/admin/general-overseer', icon: LayoutDashboard },
  {
    label: 'Attendance',
    to: '/admin/general-overseer/attendance',
    icon: ClipboardCheck,
  },
  {
    label: 'Finance',
    to: '/admin/general-overseer/finance',
    icon: CircleDollarSign,
  },
  { label: 'Developer workspace', to: '/admin/developer/overview', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const branchMediaAdminNavItems = [
  { label: 'Overview', to: '/admin/branch-media-admin', icon: LayoutDashboard },
  {
    label: 'Attendance',
    to: '/admin/branch-media-admin/attendance',
    icon: ClipboardCheck,
  },
  { label: 'Visitors', to: '/admin/branch-media-admin/visitors', icon: Users },
  { label: 'Developer workspace', to: '/admin/developer/overview', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const branchFinanceSecretaryNavItems = [
  {
    label: 'Overview',
    to: '/admin/branch-finance-secretary',
    icon: LayoutDashboard,
  },
  { label: 'Developer workspace', to: '/admin/developer/overview', icon: Wrench },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

const headquaterMediaAdminNavItems = [
  {
    label: 'Overview',
    to: '/admin/headquater-media-admin/overview',
    icon: LayoutDashboard,
  },
  {
    label: 'Upload resources',
    to: '/admin/upload-resource',
    icon: Clapperboard,
  },
  { label: 'Developer workspace', to: '/admin/developer/overview', icon: Wrench },
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
  'branch-finance-secretary': {
    navItems: branchFinanceSecretaryNavItems,
    homeTo: '/admin/branch-finance-secretary',
    profileName: 'Branch Finance Secretary',
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
    kicker: 'BAUCHI MEDIA WORKSPACE',
    title: 'Welcome Bauchi Media Admin',
    description:
      'Your media workspace is ready. Keep service resources and hymn materials organized for your church community.',
    facts: ['Bauchi, Bauchi State', 'Manage your local branch'],
    icon: Clapperboard,
  },
  'branch-finance-secretary': {
    kicker: 'BRANCH FINANCE WORKSPACE',
    title: 'Welcome, Finance Secretary',
    description:
      'Keep branch financial records and reporting organized for your congregation.',
    facts: ['Bauchi Branch', 'Finance administration'],
    icon: Landmark,
  },
  'headquater-media-admin': {
    kicker: 'HEADQUARTERS MEDIA WORKSPACE',
    title: 'Welcome to Headquarters Media',
    description:
      'Manage media and service resources for the wider church community.',
    facts: ['Headquarters Branch', 'Church-wide resources'],
    icon: Clapperboard,
  },
};

function AdminWelcomeBanner({ workspace }) {
  const details = welcomeDetails[workspace];
  if (!details) return null;
  const Icon = details.icon;

  return (
    <section
      className='branch-media-welcome'
      aria-label={`${details.title} welcome`}
    >
      <div className='branch-media-welcome-content'>
        <span className='branch-media-welcome-kicker'>{details.kicker}</span>
        <h1>{details.title}</h1>
        <p>{details.description}</p>
        <div className='branch-media-welcome-facts'>
          <span>
            <MapPin size={15} aria-hidden='true' />
            {details.facts[0]}
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
  const [collapsed, setCollapsed] = useState(false);
  const {
    navItems,
    homeTo,
    profileName,
    brandName = 'CAPA BAUCHI',
  } = workspaces[workspace] ?? workspaces.developer;
  const currentPage =
    navItems.find((item) => item.to === pathname)?.label ?? pageTitle;

  return (
    <div className={`admin-shell${collapsed ? ' is-collapsed' : ''}`}>
      <AdminSidebar
        navItems={navItems}
        homeTo={homeTo}
        homeLabel={`${profileName} workspace home`}
        brandName={brandName}
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
        {showWelcomeBanner && <AdminWelcomeBanner workspace={workspace} />}
        {children}
      </main>
    </div>
  );
}
