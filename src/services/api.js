const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/+$/,'');

async function request(path, opts = {}) {
  const url = `${API_BASE}/${String(path).replace(/^\/+/, '')}`;
  const options = { ...opts };

  // Adiciona o token de autenticação se existir
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = { 
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}) 
    };
  }

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
    options.headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  }

  const res = await fetch(url, options);

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let bodyText = null;
    try { bodyText = await res.text(); } catch (e) { /* ignore */ }
    const err = new Error(`Request failed ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = bodyText;
    throw err;
  }

  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export function get(path, opts) {
  return request(path, { method: 'GET', ...opts });
}

export function post(path, body, opts) {
  return request(path, { method: 'POST', body, ...opts });
}

export function put(path, body, opts) {
  return request(path, { method: 'PUT', body, ...opts });
}

export function del(path, opts) {
  return request(path, { method: 'DELETE', ...opts });
}

export default { API_BASE, request, get, post, put, del };
