import { useEffect, useRef, useState } from 'react';
import {
  Mail,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Pin,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import './AdminsPage.css';

const adminRecordActions = [
  { label: 'Pin', icon: Pin },
  { label: 'Update', icon: Pencil },
  { label: 'Delete', icon: Trash2, danger: true },
];

const admins = [
  {
    name: 'Grace James',
    email: 'grace.james@capa.org',
    phone: '+234 803 555 0101',
    alternatePhone: '+234 803 555 0201',
    role: 'Branch Administrator',
    branch: 'Jos Branch',
    initials: 'GJ',
    color: 'sage',
  },
  {
    name: 'Peter Daniel',
    email: 'peter.daniel@capa.org',
    phone: '+234 803 555 0102',
    alternatePhone: '+234 803 555 0202',
    role: 'Branch Administrator',
    branch: 'Wukari Branch',
    initials: 'PD',
    color: 'blue',
  },
  {
    name: 'Esther Musa',
    email: 'esther.musa@capa.org',
    phone: '+234 803 555 0103',
    alternatePhone: '+234 803 555 0203',
    role: 'Branch Administrator',
    branch: 'Bauchi Branch',
    initials: 'EM',
    color: 'lavender',
  },
  {
    name: 'Samuel John',
    email: 'samuel.john@capa.org',
    phone: '+234 803 555 0104',
    alternatePhone: '+234 803 555 0204',
    role: 'Branch Administrator',
    branch: 'Abuja Branch',
    initials: 'SJ',
    color: 'peach',
  },
  {
    name: 'Ruth David',
    email: 'ruth.david@capa.org',
    phone: '+234 803 555 0105',
    alternatePhone: '+234 803 555 0205',
    role: 'Branch Administrator',
    branch: 'Kaduna Branch',
    initials: 'RD',
    color: 'rose',
  },
  {
    name: 'Joseph Mark',
    email: 'joseph.mark@capa.org',
    phone: '+234 803 555 0106',
    alternatePhone: '+234 803 555 0206',
    role: 'Branch Administrator',
    branch: 'Yola Branch',
    initials: 'JM',
    color: 'mint',
  },
];

function AdminCard({ admin, menuOpen, onToggleMenu, onCloseMenu }) {
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event) {
      if (!actionsRef.current?.contains(event.target)) onCloseMenu();
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') onCloseMenu();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen, onCloseMenu]);

  return (
    <article className={`admin-card${menuOpen ? ' has-open-menu' : ''}`}>
      <div className='admin-card-heading'>
        <span
          className={`admin-record-avatar ${admin.color}`}
          aria-hidden='true'
        >
          {admin.initials}
        </span>
        <div className='admin-record-identity'>
          <h2>{admin.name}</h2>
          <p>
            <ShieldCheck size={15} aria-hidden='true' />
            {admin.role}
          </p>
        </div>
        <div className='admin-record-actions' ref={actionsRef}>
          <button
            className='admin-record-more'
            type='button'
            aria-label={`More actions for ${admin.name}`}
            aria-expanded={menuOpen}
            aria-controls={`admin-actions-${admin.email}`}
            onClick={onToggleMenu}
          >
            <MoreVertical size={20} aria-hidden='true' />
          </button>
          {menuOpen && (
            <div
              className='admin-record-menu'
              id={`admin-actions-${admin.email}`}
              role='menu'
              aria-label={`${admin.name} actions`}
            >
              {adminRecordActions.map(
                ({ label, icon: Icon, danger }) => (
                  <button
                    className={`admin-record-menu-item${danger ? ' is-danger' : ''}`}
                    type='button'
                    role='menuitem'
                    key={label}
                    onClick={onCloseMenu}
                  >
                    <Icon size={16} aria-hidden='true' />
                    <span>{label}</span>
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
      <div className='admin-record-details'>
        <p>
          <Mail size={16} aria-hidden='true' />
          <span>{admin.email}</span>
        </p>
        <p>
          <Phone size={16} aria-hidden='true' />
          <span>{admin.phone}</span>
        </p>
        <p>
          <Phone size={16} aria-hidden='true' />
          <span>{admin.alternatePhone} <small>(Alt)</small></span>
        </p>
      </div>
      <div className='admin-assignment'>
        <span className='admin-assignment-label'>ASSIGNED BRANCH</span>
        <span className='admin-assignment-branch'>
          <MapPin size={16} aria-hidden='true' />
          {admin.branch}
        </span>
      </div>
    </article>
  );
}

export function AdminsPage() {
  const [openAdminMenu, setOpenAdminMenu] = useState(null);

  return (
    <section className='admins-page' aria-labelledby='admins-title'>
      <header className='admins-page-heading'>
        <div>
          <p className='admins-eyebrow'>ACCESS MANAGEMENT</p>
          <h1 id='admins-title'>Admins</h1>
          <p className='admins-description'>
            Each administrator is assigned to a church branch.
          </p>
        </div>
        <span className='admins-count'>{admins.length} administrators</span>
      </header>
      <div className='admins-grid'>
        {admins.map((admin) => (
          <AdminCard
            admin={admin}
            key={admin.email}
            menuOpen={openAdminMenu === admin.email}
            onToggleMenu={() => setOpenAdminMenu((openMenu) => (
              openMenu === admin.email ? null : admin.email
            ))}
            onCloseMenu={() => setOpenAdminMenu(null)}
          />
        ))}
      </div>
    </section>
  );
}
