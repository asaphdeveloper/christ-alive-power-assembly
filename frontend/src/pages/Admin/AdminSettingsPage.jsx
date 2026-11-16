import { useState } from 'react';
import { KeyRound, LockKeyhole } from 'lucide-react';
import { useLocation } from 'react-router';
import { AdminLayout } from './AdminLayout';
import './AdminSettingsPage.css';

const initialValues = { currentPassword: '', password: '', passwordConfirm: '' };

export function AdminSettingsPage() {
  const { state } = useLocation();
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/me/password`, {
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
    <AdminLayout workspace={state?.workspace || 'developer'} pageTitle='Settings'>
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
      </section>
    </AdminLayout>
  );
}
