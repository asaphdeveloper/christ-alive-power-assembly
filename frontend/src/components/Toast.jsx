import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import './Toast.css';

const iconByType = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

export function Toast({ message, type = 'success' }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(false), 5000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!message || !isVisible) return null;
  const Icon = iconByType[type] || iconByType.success;

  return (
    <div className={`app-toast is-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon size={19} aria-hidden='true' />
      <span>{message}</span>
      <button type='button' onClick={() => setIsVisible(false)} aria-label='Dismiss notification'>
        <X size={17} aria-hidden='true' />
      </button>
    </div>
  );
}
