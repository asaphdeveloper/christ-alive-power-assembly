import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import Logo from '../../assets/images/logo.webp';
import './AdminLayout.css';

// Add, remove, or reorder sidebar groups and their links here.
const adminNavGroups = [
  {
    label: 'Workspace',
    icon: LayoutDashboard,
    links: [
      { label: 'Developer dashboard', to: '/admin/developer' },
      { label: 'Public website', to: '/' },
    ],
  },
];

export function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState(adminNavGroups[0]?.label ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={`admin-shell${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
    >
      {mobileOpen && (
        <button
          className='admin-drawer-scrim'
          aria-label='Close navigation'
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className='admin-sidebar'
        aria-label='Developer workspace navigation'
      >
        <div className='admin-sidebar-heading'>
          <Link
            className='admin-brand'
            to='/admin/developer'
            aria-label='Developer workspace home'
            title='Developer workspace'
          >
            <img src={Logo} alt='' />
            <span>
              CAPA <small>Developer</small>
            </span>
          </Link>
          <button
            className='admin-collapse-toggle'
            type='button'
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <ChevronsLeft size={18} />
            )}
          </button>
          <button
            className='admin-mobile-close'
            type='button'
            onClick={() => setMobileOpen(false)}
            aria-label='Close navigation'
          >
            <X size={19} />
          </button>
        </div>

        <nav className='admin-nav-list'>
          {adminNavGroups.map(({ label, icon: Icon, links }) => {
            const activeGroup = links.some((link) => link.to === pathname);
            const expanded = openGroup === label;
            return (
              <div className='admin-nav-group' key={label}>
                <button
                  type='button'
                  className={`admin-nav-group-toggle${activeGroup ? ' is-current' : ''}`}
                  onClick={() =>
                    collapsed
                      ? setCollapsed(false)
                      : setOpenGroup(expanded ? '' : label)
                  }
                  aria-expanded={collapsed ? false : expanded}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={18} aria-hidden='true' />
                  <span className='admin-nav-label'>{label}</span>
                  <ChevronDown
                    className={`admin-chevron${expanded && !collapsed ? ' is-open' : ''}`}
                    size={16}
                    aria-hidden='true'
                  />
                </button>
                {expanded && !collapsed && (
                  <div className='admin-subnav'>
                    {links.map(({ label: linkLabel, to }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end
                        className={({ isActive }) =>
                          `admin-subnav-link${isActive ? ' is-active' : ''}`
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className='admin-subnav-dot' />
                        <span>{linkLabel}</span>
                        {to === '/' && (
                          <ExternalLink size={14} aria-hidden='true' />
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className='admin-sidebar-bottom'>
          <span className='admin-avatar'>D</span>
          <span className='admin-user-details'>
            <strong>Developer</strong>
            <small>Workspace access</small>
          </span>
        </div>
      </aside>

      <main className='admin-main' id='main-content' tabIndex={-1}>
        <header className='admin-topbar'>
          <button
            className='admin-mobile-menu'
            type='button'
            onClick={() => setMobileOpen(true)}
            aria-label='Open navigation'
          >
            <Menu size={20} />
          </button>
          <span className='admin-breadcrumb'>
            Workspace <span>/</span> <strong>Developer dashboard</strong>
          </span>
          <Link
            className='admin-visit-site'
            to='/'
            aria-label='Visit public website'
          >
            Visit website <ExternalLink size={15} />
          </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
