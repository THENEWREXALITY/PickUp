export const API_URL = 'http://172.20.10.2:3000';

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function registerUser(name: string, email: string, password: string) {
  return request('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role: 'commuter' }),
  });
}

export function loginUser(email: string, password: string) {
  return request('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getBalance(token: string) {
  return request('/api/accounts/balance', { headers: { Authorization: `Bearer ${token}` } });
}

export function topUpBalance(token: string, amount: number) {
  return request('/api/accounts/topup', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount }),
  });
}

export function payFare(token: string, routeId: string) {
  return request('/api/transactions/pay', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ routeId }),
  });
}

export function getHistory(token: string) {
  return request('/api/transactions/history', { headers: { Authorization: `Bearer ${token}` } });
}

export function getRoutes(token: string) {
  return request('/api/routes', { headers: { Authorization: `Bearer ${token}` } });
}

export function getSummary(token: string) {
  return request('/api/admin/summary', { headers: { Authorization: `Bearer ${token}` } });
}

export function getTransactions(token: string) {
  return request('/api/admin/transactions', { headers: { Authorization: `Bearer ${token}` } });
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

export const requestRoute = (token: string, routeId: number) =>
  request('/api/permissions', { method: 'POST', headers: auth(token), body: JSON.stringify({ routeId }) });

export const getMyPermissions = (token: string) =>
  request('/api/permissions/mine', { headers: auth(token) });

export const getDriverSummary = (token: string) =>
  request('/api/permissions/summary', { headers: auth(token) });

export const getPendingPermissions = (token: string) =>
  request('/api/permissions/pending', { headers: auth(token) });

export const decidePermission = (token: string, id: number, status: 'approved' | 'rejected') =>
  request(`/api/permissions/${id}`, { method: 'PUT', headers: auth(token), body: JSON.stringify({ status }) });

export const getDrivers = (token: string) =>
  request('/api/admin/drivers', { headers: auth(token) });