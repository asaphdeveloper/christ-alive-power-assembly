import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ExternalLink, MapPinned, PanelLeftClose, PanelLeftOpen, Search, UsersRound } from 'lucide-react';
import Logo from '../../assets/images/logo.webp';
import './AdminLayout.css';

const adminNavItems = [
  { label: 'Admins', to: '/admin/developer/admins', icon: UsersRound },
  { label: 'Branches', to: '/admin/developer/branches', icon: MapPinned },
  { label: 'Public website', to: '/', icon: ExternalLink },
];

export function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentPage = adminNavItems.find((item) => item.to === pathname)?.label ?? 'Admins';

  return (
    <div className={`admin-shell${collapsed ? ' is-collapsed' : ''}`}>
      <aside className='admin-sidebar' aria-label='Developer workspace navigation'>
        <div className='admin-sidebar-heading'>
          <Link className='admin-brand' to='/admin/developer' aria-label='Developer workspace home'>
            <img src={Logo} alt='' />
            <span>CAPA <small>Developer</small></span>
          </Link>
        </div>

        <nav className='admin-nav-list'>
          {adminNavItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
              title={collapsed ? label : undefined}
              aria-label={collapsed ? label : undefined}
            >
              <Icon size={18} aria-hidden='true' />
              <span className='admin-nav-label'>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className='admin-sidebar-bottom'>
          <div className='admin-profile-button' aria-label='Developer profile'>
            <span className='admin-avatar'>D</span>
            <span className='admin-user-details'><strong>Developer</strong><small>Workspace access</small></span>
          </div>
        </div>
      </aside>

      <main className='admin-main' id='main-content' tabIndex={-1}>
        <header className='admin-topbar'>
          <button
            className='admin-collapse-toggle'
            type='button'
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <span className='admin-breadcrumb'>Workspace <span>/</span> <strong>{currentPage}</strong></span>
          <label className='admin-header-search'>
            <Search size={16} aria-hidden='true' />
            <input type='search' placeholder='Search...' aria-label='Search' readOnly />
          </label>
        </header>
        {children}
      </main>
    </div>
  );
}
