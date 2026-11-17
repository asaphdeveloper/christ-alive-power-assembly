import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch, apiUrl } from '../utils/api';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const isLoading = isCheckingSession;

  useEffect(() => {
    let isCurrent = true;
    function clearSession() {
      window.localStorage.removeItem('admin_workspace');
      if (isCurrent) {
        setAdmin(null);
        setIsCheckingSession(false);
      }
    }

    window.addEventListener('auth:expired', clearSession);
    apiFetch('/api/auth/me')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Your session has expired.');
        return result.data.admin;
      })
      .then((currentAdmin) => {
        if (!isCurrent) return;
        setAdmin(currentAdmin);
        window.localStorage.setItem('admin_workspace', currentAdmin.role);
        setIsCheckingSession(false);
      })
      .catch(() => {
        if (isCurrent) clearSession();
      });

    return () => {
      isCurrent = false;
      window.removeEventListener('auth:expired', clearSession);
    };
  }, []);

  const signIn = useCallback(async (credentials) => {
    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      if (result?.message) throw new Error(result.message);
      throw new Error(`Sign-in failed (HTTP ${response.status}). Check that the backend API is running and its URL is configured correctly.`);
    }
    if (!result) throw new Error('The sign-in service returned an unreadable response. Check the backend API URL.');
    if (!result.data?.admin) {
      throw new Error('The sign-in response was incomplete. Please try again.');
    }

    const signedInAdmin = result.data.admin;
    window.localStorage.setItem(
      'admin_workspace',
      signedInAdmin.role,
    );
    setAdmin(signedInAdmin);
    setIsCheckingSession(false);
    return signedInAdmin;
  }, []);

  const signOut = useCallback(async () => {
    window.localStorage.removeItem('admin_workspace');
    await fetch(apiUrl('/api/auth/logout'), {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ admin, isLoading, isAuthenticated: Boolean(admin), signIn, signOut }),
    [admin, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
