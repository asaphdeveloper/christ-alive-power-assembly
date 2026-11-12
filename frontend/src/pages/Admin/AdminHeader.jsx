import {
  Bell,
  CircleHelp,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
} from 'lucide-react';
import './AdminHeader.css';

export function AdminHeader({ workspaceName, currentPage, collapsed, onToggleSidebar }) {
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
    </header>
  );
}
