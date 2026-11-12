import { Link, NavLink } from 'react-router';
import { UserRound } from 'lucide-react';
import Logo from '../../assets/images/logo.webp';
import './AdminSidebar.css';

export function AdminSidebar({
  navItems,
  homeTo,
  homeLabel,
  navigationLabel,
  profileName,
  profileDescription,
  collapsed,
}) {
  return (
    <aside className='admin-sidebar' aria-label={navigationLabel}>
      <div className='admin-sidebar-heading'>
        <Link className='admin-brand' to={homeTo} aria-label={homeLabel}>
          <img src={Logo} alt='' />
          <span>CAPA</span>
        </Link>
      </div>

      <nav className='admin-nav-list'>
        {navItems.map(({ label, to, icon: Icon }) => (
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
        <div className='admin-profile-button' aria-label={`${profileName} profile`}>
          <span className='admin-avatar'><UserRound size={17} aria-hidden='true' /></span>
          <span className='admin-user-details'>
            <strong>{profileName}</strong>
            <small>{profileDescription}</small>
          </span>
        </div>
      </div>
    </aside>
  );
}
