import { useState } from 'react';
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
      <div className='admin-header-account'>
        {isAccountMenuOpen && (
          <div className='admin-header-account-menu' role='menu' aria-label='Account menu'>
            <button
              type='button'
              className='admin-header-account-menu-item'
              role='menuitem'
              onClick={() => setIsAccountMenuOpen(false)}
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
