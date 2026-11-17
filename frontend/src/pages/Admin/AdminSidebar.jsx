import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import Logo from '../../assets/images/logo.webp';
import './AdminSidebar.css';

export function AdminSidebar({
  navItems,
  homeTo,
  homeLabel,
  brandName,
  navigationLabel,
  profileName,
  profileDescription,
  workspace,
  collapsed,
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) setIsProfileMenuOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsProfileMenuOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  function handleLogOut() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <aside className='admin-sidebar' aria-label={navigationLabel}>
      <div className='admin-sidebar-heading'>
        <Link className='admin-brand' to={homeTo} aria-label={homeLabel}>
          <img src={Logo} alt='' />
          <span>{brandName}</span>
        </Link>
      </div>

      <nav className='admin-nav-list'>
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            state={to === '/admin/settings' ? { workspace } : undefined}
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
        <div className='admin-profile-menu-wrap' ref={profileMenuRef}>
          {isProfileMenuOpen && (
            <div className='admin-profile-menu' role='menu' aria-label={`${profileName} account menu`}>
              <button type='button' className='admin-profile-menu-item' role='menuitem' onClick={handleLogOut}>
                <LogOut size={16} aria-hidden='true' />
                <span>Log out</span>
              </button>
            </div>
          )}
          <button
            className='admin-profile-button'
            type='button'
            aria-label={`${profileName} profile menu`}
            aria-haspopup='menu'
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
          >
            <span className='admin-avatar'><UserRound size={17} aria-hidden='true' /></span>
            <span className='admin-user-details'>
              <strong>{profileName}</strong>
              <small>{profileDescription}</small>
            </span>
            <ChevronDown className='admin-profile-chevron' size={15} aria-hidden='true' />
          </button>
        </div>
      </div>
    </aside>
  );
}
