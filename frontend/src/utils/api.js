const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

export function apiUrl(path) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = window.localStorage.getItem('access_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(apiUrl(path), { ...options, headers });
  if (response.status === 401) {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('admin_workspace');
    window.dispatchEvent(new Event('auth:expired'));
  }
  return response;
}
