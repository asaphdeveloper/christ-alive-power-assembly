import { useEffect, useRef, useState } from 'react';
import {
  Mail,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Pin,
  Plus,
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
              {adminRecordActions.map(({ label, icon: Icon, danger }) => (
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
              ))}
            </div>
          )}
        </div>
      </div>
      <div className='admin-record-details'>
        <p className='admin-contact-email'>
          <Mail size={16} aria-hidden='true' />
          <span>{admin.email}</span>
        </p>
        <p className='admin-contact-phone'>
          <svg
            className='admin-whatsapp-icon'
            viewBox='0 0 24 24'
            role='img'
            aria-label='WhatsApp'
          >
            <path
              d='M12 2a10 10 0 0 0-8.65 15.01L2 22l5.13-1.34A10 10 0 1 0 12 2Z'
              fill='currentColor'
            />
            <path
              d='M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.25-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z'
              fill='#fff'
              transform='translate(1.8 1.8) scale(.84)'
            />
          </svg>
          <span className='admin-contact-value'>{admin.phone}</span>
        </p>
        <p className='admin-contact-phone'>
          <Phone size={16} aria-hidden='true' />
          <span className='admin-contact-value'>{admin.alternatePhone}</span>
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
          <h1 id='admins-title'>Admins</h1>
          <p className='admins-description'>
            Each administrator is assigned to a church branch.
          </p>
        </div>
        <div className='admins-heading-actions'>
          <span className='admins-count'>{admins.length} administrators</span>
          <button className='admins-add-button' type='button'>
            <Plus size={16} aria-hidden='true' />
            Add Admin
          </button>
        </div>
      </header>
      <div className='admins-grid'>
        {admins.map((admin) => (
          <AdminCard
            admin={admin}
            key={admin.email}
            menuOpen={openAdminMenu === admin.email}
            onToggleMenu={() =>
              setOpenAdminMenu((openMenu) =>
                openMenu === admin.email ? null : admin.email,
              )
            }
            onCloseMenu={() => setOpenAdminMenu(null)}
          />
        ))}
      </div>
    </section>
  );
}
