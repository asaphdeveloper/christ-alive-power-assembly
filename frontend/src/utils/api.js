const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

export function apiUrl(path) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const response = await fetch(apiUrl(path), { ...options, headers, credentials: 'include' });
  if (response.status === 401) {
    window.localStorage.removeItem('admin_workspace');
    window.dispatchEvent(new Event('auth:expired'));
  }
  return response;
}
