import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  CircleUserRound,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Pin,
  Plus,
  KeyRound,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import branches from '../../../../../data/branches.json';
import initialAdmins from '../../../../../data/admins.json';
import './AdminsPage.css';

const roleOptions = [
  'General Overseer',
  'Developer',
  'Headquater Media Admin',
  'Branch Media Admin',
  'Branch Pastor',
  'Branch Finance Secretary',
  'Branch Administrator',
];

const avatarColors = ['sage', 'blue', 'lavender', 'peach', 'rose', 'mint'];
const branchOptions = [
  ...new Set([
    ...branches.map((branch) => branch.name),
    'Bauchi Branch',
    'Abuja Branch',
    'Kaduna Branch',
  ]),
];
const emptyAdminForm = {
  name: '',
  username: '',
  phone: '',
  alternatePhone: '',
  role: roleOptions[3],
  branch: branches[0]?.name ?? '',
};

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function AdminCard({
  admin,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onUpdatePassword,
  onDelete,
  onTogglePin,
}) {
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

  const actions = [
    { label: admin.pinned ? 'Unpin' : 'Pin', icon: Pin, onClick: onTogglePin },
    { label: 'Update', icon: Pencil, onClick: onEdit },
    { label: 'Update password', icon: KeyRound, onClick: onUpdatePassword },
    { label: 'Delete', icon: Trash2, danger: true, onClick: onDelete },
  ];

  return (
    <article
      className={`admin-card${menuOpen ? ' has-open-menu' : ''}${admin.pinned ? ' is-pinned' : ''}`}
    >
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
            aria-controls={`admin-actions-${admin.id}`}
            onClick={onToggleMenu}
          >
            <MoreVertical size={20} aria-hidden='true' />
          </button>
          {menuOpen && (
            <div
              className='admin-record-menu'
              id={`admin-actions-${admin.id}`}
              role='menu'
              aria-label={`${admin.name} actions`}
            >
              {actions.map(({ label, icon: Icon, danger, onClick }) => (
                <button
                  className={`admin-record-menu-item${danger ? ' is-danger' : ''}`}
                  type='button'
                  role='menuitem'
                  key={label}
                  onClick={() => {
                    onClick();
                    onCloseMenu();
                  }}
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
        <p className='admin-contact-username'>
          <CircleUserRound size={16} aria-hidden='true' />
          <span>{admin.username}</span>
        </p>
        <p className='admin-contact-phone'>
          <Phone size={16} aria-hidden='true' />
          <span className='admin-contact-value'>
            {admin.phone || 'No phone number'}
          </span>
        </p>
        <p className='admin-contact-phone'>
          <Phone size={16} aria-hidden='true' />
          <span className='admin-contact-value'>
            {admin.alternatePhone || 'No alternate number'}
          </span>
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

function AdminPasswordForm({ admin, onSubmit, onCancel }) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    onSubmit();
  }

  return (
    <div
      className='admin-form-backdrop'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        className='admin-form-dialog admin-password-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='admin-password-title'
      >
        <header className='admin-form-heading'>
          <div className='admin-form-title-icon'>
            <KeyRound size={20} aria-hidden='true' />
          </div>
          <div>
            <h2 id='admin-password-title'>Update password</h2>
            <p>Set a new password for {admin.name}.</p>
          </div>
          <button
            className='admin-form-close'
            type='button'
            onClick={onCancel}
            aria-label='Close form'
          >
            <X size={19} aria-hidden='true' />
          </button>
        </header>
        <form
          className='admin-form admin-password-form'
          onSubmit={handleSubmit}
        >
          <label className='admin-form-field admin-form-field-wide'>
            New password
            <input
              name='password'
              type='password'
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              autoComplete='new-password'
              minLength={8}
              required
            />
          </label>
          <label className='admin-form-field admin-form-field-wide'>
            Confirm password
            <input
              name='passwordConfirm'
              type='password'
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                setError('');
              }}
              autoComplete='new-password'
              minLength={8}
              required
            />
          </label>
          {error && (
            <p className='admin-form-error' role='alert'>
              {error}
            </p>
          )}
          <div className='admin-form-actions'>
            <button
              className='admin-form-cancel'
              type='button'
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className='admin-form-submit' type='submit'>
              Update password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function AdminForm({ admin, onSubmit, onCancel }) {
  const [form, setForm] = useState(admin ?? emptyAdminForm);
  const [error, setError] = useState('');

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
      ...(event.target.name === 'role' &&
      ['General Overseer', 'Developer'].includes(event.target.value)
        ? { branch: '' }
        : {}),
    }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (
      form.role !== 'General Overseer' &&
      form.role !== 'Developer' &&
      !form.branch
    ) {
      setError('Select a branch for this administrator.');
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
    });
  }

  return (
    <div
      className='admin-form-backdrop'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        className='admin-form-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='admin-form-title'
      >
        <header className='admin-form-heading'>
          <div className='admin-form-title-icon'>
            <CircleUserRound size={20} aria-hidden='true' />
          </div>
          <div>
            <h2 id='admin-form-title'>
              {admin ? 'Update administrator' : 'Add administrator'}
            </h2>
            <p>Enter the administrator’s account and assignment details.</p>
          </div>
          <button
            className='admin-form-close'
            type='button'
            onClick={onCancel}
            aria-label='Close form'
          >
            <X size={19} aria-hidden='true' />
          </button>
        </header>
        <form className='admin-form' onSubmit={handleSubmit}>
          <label className='admin-form-field admin-form-field-wide'>
            Username
            <input
              name='username'
              type='text'
              value={form.username}
              onChange={updateField}
              autoComplete='username'
              minLength={3}
              maxLength={32}
              pattern='[A-Za-z0-9._@-]+'
              required
            />
          </label>
          <label className='admin-form-field'>
            Phone number
            <input
              name='phone'
              type='tel'
              value={form.phone}
              onChange={updateField}
              autoComplete='tel'
            />
          </label>
          <label className='admin-form-field'>
            Alternate phone
            <input
              name='alternatePhone'
              type='tel'
              value={form.alternatePhone}
              onChange={updateField}
            />
          </label>
          <label className='admin-form-field'>
            Administrator role
            <span className='admin-form-select-wrap'>
              <select name='role' value={form.role} onChange={updateField}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden='true' />
            </span>
          </label>
          <label className='admin-form-field'>
            Assigned branch
            <span className='admin-form-select-wrap'>
              <select name='branch' value={form.branch} onChange={updateField}>
                <option value=''>Select a branch</option>
                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden='true' />
            </span>
          </label>
          {error && (
            <p className='admin-form-error' role='alert'>
              {error}
            </p>
          )}
          <div className='admin-form-actions'>
            <button
              className='admin-form-cancel'
              type='button'
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className='admin-form-submit' type='submit'>
              {admin ? (
                <Check size={16} aria-hidden='true' />
              ) : (
                <Plus size={16} aria-hidden='true' />
              )}
              {admin ? 'Save changes' : 'Add administrator'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function AdminsPage() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [openAdminMenu, setOpenAdminMenu] = useState(null);
  const [formAdmin, setFormAdmin] = useState(undefined);
  const [passwordAdmin, setPasswordAdmin] = useState(null);
  const [feedback, setFeedback] = useState('');

  function saveAdmin(form) {
    const name = form.name.trim();
    if (formAdmin?.id) {
      setAdmins((current) =>
        current.map((admin) =>
          admin.id === formAdmin.id
            ? { ...admin, ...form, name, initials: getInitials(name) }
            : admin,
        ),
      );
      setFeedback('Administrator details updated.');
    } else {
      const newAdmin = {
        ...form,
        name,
        id: `admin-${Date.now()}`,
        initials: getInitials(name),
        color: avatarColors[admins.length % avatarColors.length],
        pinned: false,
      };
      setAdmins((current) => [newAdmin, ...current]);
      setFeedback('Administrator added to this dashboard.');
    }
    setFormAdmin(undefined);
  }

  function deleteAdmin(admin) {
    setAdmins((current) => current.filter((item) => item.id !== admin.id));
    setFeedback(`${admin.name} removed from this dashboard.`);
  }

  function togglePin(admin) {
    setAdmins((current) =>
      current.map((item) =>
        item.id === admin.id ? { ...item, pinned: !item.pinned } : item,
      ),
    );
  }

  function submitPasswordUpdate() {
    const adminName = passwordAdmin?.name;
    setPasswordAdmin(null);
    if (adminName) {
      setFeedback(
        `Password form completed for ${adminName}. Connect this temporary frontend list to the admin API to save it.`,
      );
    }
  }

  const orderedAdmins = [...admins].sort(
    (first, second) => Number(second.pinned) - Number(first.pinned),
  );

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
          <span className='admins-count'>
            {admins.length}{' '}
            {admins.length === 1 ? 'administrator' : 'administrators'}
          </span>
          <button
            className='admins-add-button'
            type='button'
            onClick={() => setFormAdmin(null)}
          >
            <Plus size={16} aria-hidden='true' />
            Add Admin
          </button>
        </div>
      </header>
      {feedback && (
        <p className='admins-feedback' role='status'>
          {feedback}
        </p>
      )}
      {orderedAdmins.length ? (
        <div className='admins-grid'>
          {orderedAdmins.map((admin) => (
            <AdminCard
              key={admin.id}
              admin={admin}
              menuOpen={openAdminMenu === admin.id}
              onToggleMenu={() =>
                setOpenAdminMenu((openMenu) =>
                  openMenu === admin.id ? null : admin.id,
                )
              }
              onCloseMenu={() => setOpenAdminMenu(null)}
              onEdit={() => setFormAdmin(admin)}
              onUpdatePassword={() => setPasswordAdmin(admin)}
              onDelete={() => deleteAdmin(admin)}
              onTogglePin={() => togglePin(admin)}
            />
          ))}
        </div>
      ) : (
        <div className='admins-empty-state'>
          <CircleUserRound size={28} aria-hidden='true' />
          <h2>No administrators yet</h2>
          <p>Add an administrator to get started.</p>
          <button
            className='admins-add-button'
            type='button'
            onClick={() => setFormAdmin(null)}
          >
            <Plus size={16} aria-hidden='true' />
            Add Admin
          </button>
        </div>
      )}
      {formAdmin !== undefined && (
        <AdminForm
          key={formAdmin?.id ?? 'new-admin'}
          admin={formAdmin}
          onSubmit={saveAdmin}
          onCancel={() => setFormAdmin(undefined)}
        />
      )}
      {passwordAdmin && (
        <AdminPasswordForm
          admin={passwordAdmin}
          onSubmit={submitPasswordUpdate}
          onCancel={() => setPasswordAdmin(null)}
        />
      )}
    </section>
  );
}
