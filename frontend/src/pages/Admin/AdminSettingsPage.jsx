import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { apiFetch } from '../../utils/api';
import { AdminLayout } from './AdminLayout';
import './AdminSettingsPage.css';

export function AdminSettingsPage() {
  const { state } = useLocation();
  const storedWorkspace = typeof window === 'undefined'
    ? null
    : window.localStorage.getItem('admin_workspace');
  const workspace = state?.workspace || storedWorkspace || 'developer';
  const [resourceUsage, setResourceUsage] = useState(null);
  const [usageError, setUsageError] = useState('');

  useEffect(() => {
    if (workspace !== 'developer') return;
    const token = window.localStorage.getItem('access_token');
    if (!token) return;
    apiFetch('/api/resources/manage/usage', {
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

  return (
    <AdminLayout workspace={workspace} pageTitle='Settings'>
      <div className='admin-settings-layout'>
        {workspace === 'developer' && (
          <section className='admin-settings-usage' aria-labelledby='admin-settings-usage-title'>
            <header>
              <h2 id='admin-settings-usage-title'>Cloudflare Upload Usage</h2>
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
      </div>
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
