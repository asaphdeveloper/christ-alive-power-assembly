import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  CircleUserRound,
  Eye,
  EyeOff,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  KeyRound,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { apiFetch } from '../../../../utils/api';
import emptyIllustration from '../../../../assets/images/empty.svg';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Toast } from '../../../../components/Toast';
import './AdminsPage.css';

const roleOptions = ['Branch Media Admin'];
const protectedRoles = new Set(['developer', 'general-overseer', 'headquater-media-admin']);

function formatAdminRole(role = '') {
  return role
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getAdminInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function getAvatarColor(name = '') {
  const colors = ['sage', 'blue', 'lavender', 'peach', 'rose', 'mint'];
  const hash = [...name.toLowerCase()].reduce((value, character) => value + character.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

const emptyAdminForm = {
  name: '',
  username: '',
  phone: '',
  alternatePhone: '',
  role: roleOptions[0],
  branch: '',
  password: '',
};

function AdminCard({
  admin,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onUpdatePassword,
  onDelete,
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
    { label: 'Update', icon: Pencil, onClick: onEdit },
    { label: 'Reset password', icon: KeyRound, onClick: onUpdatePassword },
    ...(!protectedRoles.has(admin.role)
      ? [{ label: 'Delete', icon: Trash2, danger: true, onClick: onDelete }]
      : []),
  ];

  return (
    <article
      className={`admin-card${menuOpen ? ' has-open-menu' : ''}`}
    >
      <div className='admin-card-heading'>
        <span
          className={`admin-record-avatar ${getAvatarColor(admin.name)}`}
          aria-hidden='true'
        >
          {getAdminInitials(admin.name)}
        </span>
        <div className='admin-record-identity'>
          <h2>{admin.name}</h2>
          <p>
            <ShieldCheck size={15} aria-hidden='true' />
            {formatAdminRole(admin.role)}
          </p>
        </div>
        <div className='admin-record-actions' ref={actionsRef}>
          <button
            className='admin-record-more'
            type='button'
            aria-label={`More actions for ${admin.name}`}
            aria-expanded={menuOpen}
            aria-controls={`admin-actions-${admin._id}`}
            onClick={onToggleMenu}
          >
            <MoreVertical size={20} aria-hidden='true' />
          </button>
          {menuOpen && (
            <div
              className='admin-record-menu'
              id={`admin-actions-${admin._id}`}
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
          {admin.branch?.name || 'No branch assigned'}
        </span>
      </div>
    </article>
  );
}

function AdminPasswordForm({ admin, onSubmit, onCancel }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    onSubmit(password);
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
            <h2 id='admin-password-title'>Reset password</h2>
            <p>Set a new password for {admin.name}. It will be shown once after reset.</p>
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
            <span className='admin-password-input-wrap'>
              <input
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
                autoComplete='new-password'
                minLength={8}
                required
              />
              <button
                className='admin-password-toggle'
                type='button'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((shown) => !shown)}
              >
                {showPassword ? <EyeOff size={17} aria-hidden='true' /> : <Eye size={17} aria-hidden='true' />}
              </button>
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
              Reset password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function AdminForm({ admin, branches, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    admin ? { ...emptyAdminForm, ...admin, branch: admin.branch?._id ?? '' } : emptyAdminForm,
  );
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    if (!admin && !form.branch) {
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
            Full name
            <input
              name='name'
              value={form.name}
              onChange={updateField}
              autoComplete='name'
              placeholder='e.g. Grace James'
              required
            />
          </label>
          <label className='admin-form-field admin-form-field-wide'>
            Username
            <input
              name='username'
              type='text'
              value={form.username}
              onChange={updateField}
              autoComplete='username'
              placeholder='e.g. grace@media@admin'
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
              placeholder='+234 800 000 0000'
            />
          </label>
          <label className='admin-form-field'>
            Alternate phone
            <input
              name='alternatePhone'
              type='tel'
              value={form.alternatePhone}
              onChange={updateField}
              placeholder='+234 800 000 0000'
            />
          </label>
          <label className='admin-form-field'>
            Administrator role
            <span className='admin-form-select-wrap'>
              <select name='role' value={form.role} disabled>
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
              <select
                name='branch'
                value={form.branch}
                onChange={updateField}
                required={!admin}
                disabled={Boolean(admin)}
              >
                <option value=''>Select a branch</option>
                {branches.filter((branch) => !branch.admin).map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden='true' />
            </span>
          </label>
          {!admin && (
            <label className='admin-form-field admin-form-field-wide'>
              Password
              <span className='admin-password-input-wrap'>
                <input name='password' type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} autoComplete='new-password' minLength={8} required />
                <button
                  className='admin-password-toggle'
                  type='button'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((shown) => !shown)}
                >
                  {showPassword ? <EyeOff size={17} aria-hidden='true' /> : <Eye size={17} aria-hidden='true' />}
                </button>
              </span>
            </label>
          )}
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
  const [admins, setAdmins] = useState([]);
  const [branchRecords, setBranchRecords] = useState([]);
  const [openAdminMenu, setOpenAdminMenu] = useState(null);
  const [formAdmin, setFormAdmin] = useState(undefined);
  const [passwordAdmin, setPasswordAdmin] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const notify = useCallback((message, type = 'success') => {
    setFeedback({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([apiFetch('/api/admin'), apiFetch('/api/branches')])
      .then(async ([adminResponse, branchResponse]) => {
        const [adminResult, branchResult] = await Promise.all([adminResponse.json(), branchResponse.json()]);
        if (!adminResponse.ok) throw new Error(adminResult.message || 'Could not load administrators.');
        if (!branchResponse.ok) throw new Error(branchResult.message || 'Could not load branches.');
        if (!active) return;
        setAdmins(adminResult.data.admins);
        setBranchRecords(branchResult.data.branches);
      })
      .catch((error) => active && notify(error.message, 'error'))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, [notify]);

  function saveAdmin(form) {
    const name = form.name.trim();
    if (formAdmin?._id) {
      apiFetch(`/api/admin/${formAdmin._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, username: form.username, phone: form.phone, alternatePhone: form.alternatePhone }) })
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.message || 'Could not update this administrator.');
          setAdmins((current) => current.map((admin) => admin._id === result.data.admin._id ? { ...admin, ...result.data.admin } : admin));
          notify('Administrator details updated.');
          setFormAdmin(undefined);
        }).catch((error) => notify(error.message, 'error'));
      return;
    } else {
      apiFetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, username: form.username, role: 'branch-media-admin', branch: form.branch, password: form.password, phone: form.phone, alternatePhone: form.alternatePhone }) })
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.message || 'Could not create this administrator.');
          setAdmins((current) => [result.data.admin, ...current]);
          const branchResponse = await apiFetch('/api/branches');
          const branchResult = await branchResponse.json();
          if (branchResponse.ok) setBranchRecords(branchResult.data.branches);
          notify(`Branch Media Admin account created. Save this password securely: ${form.password}`);
          setFormAdmin(undefined);
        }).catch((error) => notify(error.message, 'error'));
      return;
    }
  }

  function deleteAdmin(admin) {
    apiFetch(`/api/admin/${admin._id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Could not delete this administrator.');
        setAdmins((current) => current.filter((item) => item._id !== admin._id));
        setBranchRecords((current) => current.map((branch) => branch.admin?._id === admin._id ? { ...branch, admin: null, status: 'pending-admin' } : branch));
        notify(`${admin.name} removed.`);
      }).catch((error) => notify(error.message, 'error'));
  }

  function submitPasswordUpdate(password) {
    const targetAdmin = passwordAdmin;
    if (targetAdmin) {
      apiFetch(`/api/admin/${targetAdmin._id}/password`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
        .then(async (response) => {
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.message || 'Could not reset this password.');
          setPasswordAdmin(null);
          notify(`Password reset for ${targetAdmin.name}. New password: ${password}`);
        }).catch((error) => notify(error.message, 'error'));
    }
  }

  const orderedAdmins = admins;

  return (
    <section className={`admins-page${!isLoading && orderedAdmins.length === 0 ? ' is-empty' : ''}`} aria-labelledby='admins-title' aria-busy={isLoading}>
      <header className='admins-page-heading'>
        <div>
          <h1 id='admins-title'>Admins</h1>
          <p className='admins-description'>Branch Media Admin accounts assigned to church branches.</p>
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
      {feedback && <Toast key={feedback.id} message={feedback.message} type={feedback.type} />}
      {isLoading ? (
        <div className='admins-loading-state' role='status'>
          <LoadingSpinner />
          <span>Loading administrators…</span>
        </div>
      ) : orderedAdmins.length ? (
        <div className='admins-grid'>
          {orderedAdmins.map((admin) => (
            <AdminCard
              key={admin._id}
              admin={admin}
              menuOpen={openAdminMenu === admin._id}
              onToggleMenu={() =>
                setOpenAdminMenu((openMenu) =>
                  openMenu === admin._id ? null : admin._id,
                )
              }
              onCloseMenu={() => setOpenAdminMenu(null)}
              onEdit={() => setFormAdmin(admin)}
              onUpdatePassword={() => setPasswordAdmin(admin)}
              onDelete={() => deleteAdmin(admin)}
            />
          ))}
        </div>
      ) : (
        <div className='admins-empty-state'>
          <img src={emptyIllustration} alt='' aria-hidden='true' />
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
          branches={branchRecords}
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
