import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UserRound,
} from 'lucide-react';
import './AdminHeader.css';

export function AdminHeader({ workspaceName, currentPage, collapsed, onToggleSidebar }) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    if (!isAccountMenuOpen) return undefined;
    function handlePointerDown(event) {
      if (!accountMenuRef.current?.contains(event.target)) setIsAccountMenuOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsAccountMenuOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  function handleLogOut() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <header className='admin-topbar'>
      <button
        className='admin-collapse-toggle'
        type='button'
        onClick={onToggleSidebar}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>
      <span className='admin-breadcrumb'>
        {workspaceName} <span>/</span> <strong>{currentPage}</strong>
      </span>
      <label className='admin-header-search'>
        <Search size={17} aria-hidden='true' />
        <input
          type='search'
          placeholder='Search workspace'
          aria-label='Search workspace'
        />
      </label>
      <button
        className='admin-header-action admin-notifications-button'
        type='button'
        aria-label='Notifications, 2 unread'
      >
        <Bell size={18} aria-hidden='true' />
        <span className='admin-notification-count' aria-hidden='true'>
          2
        </span>
      </button>
      <button className='admin-header-action' type='button' aria-label='Help'>
        <CircleHelp size={18} aria-hidden='true' />
      </button>
      <button
        className='admin-header-action'
        type='button'
        aria-label='Settings'
      >
        <Settings size={18} aria-hidden='true' />
      </button>
      <div className='admin-header-account' ref={accountMenuRef}>
        {isAccountMenuOpen && (
          <div className='admin-header-account-menu' role='menu' aria-label='Account menu'>
            <button
              type='button'
              className='admin-header-account-menu-item'
              role='menuitem'
              onClick={handleLogOut}
            >
              <LogOut size={16} aria-hidden='true' />
              <span>Log out</span>
            </button>
          </div>
        )}
        <button
          className='admin-header-account-button'
          type='button'
          aria-label={`${workspaceName} account menu`}
          aria-haspopup='menu'
          aria-expanded={isAccountMenuOpen}
          onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
        >
          <span className='admin-header-account-avatar'><UserRound size={17} aria-hidden='true' /></span>
          <span className='admin-header-account-name'>{workspaceName}</span>
          <ChevronDown className='admin-header-account-chevron' size={15} aria-hidden='true' />
        </button>
      </div>
    </header>
  );
}
