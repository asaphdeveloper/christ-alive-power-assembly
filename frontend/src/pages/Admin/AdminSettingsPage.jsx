import { useEffect, useState } from 'react';
import { KeyRound, LockKeyhole } from 'lucide-react';
import { useLocation } from 'react-router';
import { apiUrl } from '../../utils/api';
import { AdminLayout } from './AdminLayout';
import './AdminSettingsPage.css';

const initialValues = { currentPassword: '', password: '', passwordConfirm: '' };

export function AdminSettingsPage() {
  const { state } = useLocation();
  const storedWorkspace = typeof window === 'undefined'
    ? null
    : window.localStorage.getItem('admin_workspace');
  const workspace = state?.workspace || storedWorkspace || 'developer';
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [resourceUsage, setResourceUsage] = useState(null);
  const [usageError, setUsageError] = useState('');

  useEffect(() => {
    if (workspace !== 'developer') return;
    const token = window.localStorage.getItem('access_token');
    if (!token) return;
    fetch(apiUrl('/api/resources/manage/usage'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to load R2 usage.');
        return result.data.usage;
      })
      .then(setResourceUsage)
      .catch((error) => setUsageError(error.message));
  }, [workspace]);

  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (values.password.length < 8) {
      setMessageType('error');
      setMessage('Your new password must be at least 8 characters.');
      return;
    }
    if (values.password !== values.passwordConfirm) {
      setMessageType('error');
      setMessage('The new passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const token = window.localStorage.getItem('access_token');
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      const response = await fetch(apiUrl('/api/admin/me/password'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update your password.');
      window.localStorage.removeItem('access_token');
      setValues(initialValues);
      setMessageType('success');
      setMessage('Password updated. Please sign in again with your new password.');
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'Unable to update your password.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout workspace={workspace} pageTitle='Settings'>
      <section className='admin-settings-page' aria-labelledby='admin-settings-title'>
        <header className='admin-settings-heading'>
          <span className='admin-settings-icon'><KeyRound size={20} aria-hidden='true' /></span>
          <div>
            <h1 id='admin-settings-title'>Account settings</h1>
            <p>Change the password you use to sign in to your admin account.</p>
          </div>
        </header>
        <form className='admin-settings-form' onSubmit={handleSubmit}>
          <label>
            <span>Current password</span>
            <span className='admin-settings-input'><LockKeyhole size={17} aria-hidden='true' /><input name='currentPassword' type='password' value={values.currentPassword} onChange={handleChange} autoComplete='current-password' required /></span>
          </label>
          <label>
            <span>New password</span>
            <span className='admin-settings-input'><LockKeyhole size={17} aria-hidden='true' /><input name='password' type='password' value={values.password} onChange={handleChange} autoComplete='new-password' minLength={8} required /></span>
          </label>
          <label>
            <span>Confirm new password</span>
            <span className='admin-settings-input'><LockKeyhole size={17} aria-hidden='true' /><input name='passwordConfirm' type='password' value={values.passwordConfirm} onChange={handleChange} autoComplete='new-password' minLength={8} required /></span>
          </label>
          {message && <p className={`admin-settings-message is-${messageType}`} role='status'>{message}</p>}
          <button type='submit' disabled={isSaving}>{isSaving ? 'Updating…' : 'Update password'}</button>
        </form>
        {workspace === 'developer' && (
          <section className='admin-settings-usage' aria-labelledby='admin-settings-usage-title'>
            <header>
              <h2 id='admin-settings-usage-title'>Resource storage usage</h2>
              <p>Monthly app usage against its R2 safety limits{resourceUsage ? ` · ${resourceUsage.month}` : ''}</p>
            </header>
            {usageError && <p className='admin-settings-usage-error' role='status'>{usageError}</p>}
            {resourceUsage && !resourceUsage.r2Configured && (
              <p className='admin-settings-usage-error' role='status'>Cloudflare R2 is not configured yet. Usage will appear after the backend is connected to R2.</p>
            )}
            {resourceUsage?.r2Configured && (
              <div className='admin-settings-usage-meters'>
                <UsageMeter label='Stored PDFs' value={resourceUsage.storageBytes} limit={resourceUsage.storageBudgetBytes} format={formatBytes} />
                <UsageMeter label='Monthly PDF reads' value={resourceUsage.reads} limit={resourceUsage.monthlyReadBudget} format={(value) => value.toLocaleString()} />
                <UsageMeter label='Monthly uploads and deletes' value={resourceUsage.writes} limit={resourceUsage.monthlyWriteBudget} format={(value) => value.toLocaleString()} />
              </div>
            )}
            <p className='admin-settings-usage-note'>Uploads, deletes, and reads pause at these app safety limits. This meter does not include other buckets or services in your Cloudflare account, so it cannot guarantee a $0 account-wide bill.</p>
          </section>
        )}
      </section>
    </AdminLayout>
  );
}

function formatBytes(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function UsageMeter({ label, value, limit, format }) {
  const percentage = limit ? Math.min(100, (value / limit) * 100) : 0;
  return (
    <div className='admin-settings-usage-meter'>
      <div><strong>{label}</strong><span>{format(value)} / {format(limit)}</span></div>
      <progress value={percentage} max='100' aria-label={`${label}: ${percentage.toFixed(1)} percent of safety limit`} />
      <small>{percentage.toFixed(1)}% of app safety limit</small>
    </div>
  );
}
