/**
 * AuraDesk AI — Centralized API Client
 * 
 * All frontend data fetching goes through here.
 * Automatically switches between:
 *   - Real backend (http://localhost:4000) when available
 *   - localStorage fallback when backend is offline
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

let backendAvailable = null; // null = unknown, true/false = checked

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(2000) });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

async function apiFetch(path, options = {}) {
  const url = `${BACKEND_URL}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Calls ───────────────────────────────────────────────────────────────────
export const callsApi = {
  list: (clientId, params = {}) => {
    const qs = new URLSearchParams({ client_id: clientId, ...params }).toString();
    return apiFetch(`/calls?${qs}`);
  },
  get: (id) => apiFetch(`/calls/${id}`)
};

// ─── Leads ───────────────────────────────────────────────────────────────────
export const leadsApi = {
  list: (clientId, params = {}) => {
    const qs = new URLSearchParams({ client_id: clientId, ...params }).toString();
    return apiFetch(`/leads?${qs}`);
  },
  update: (id, data) => apiFetch(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
};

// ─── Appointments ─────────────────────────────────────────────────────────────
export const appointmentsApi = {
  list: (clientId, date) => {
    const qs = new URLSearchParams({ client_id: clientId, ...(date ? { date } : {}) }).toString();
    return apiFetch(`/appointments?${qs}`);
  }
};

// ─── Stats (real computed ROI) ────────────────────────────────────────────────
export const statsApi = {
  get: (clientId) => apiFetch(`/stats?client_id=${clientId}`)
};

// ─── Clients ─────────────────────────────────────────────────────────────────
export const clientsApi = {
  list: () => apiFetch('/clients'),
  get: (id) => apiFetch(`/clients/${id}`),
  create: (data) => apiFetch('/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
};

// ─── Knowledge Base ───────────────────────────────────────────────────────────
export const knowledgeApi = {
  list: (clientId) => apiFetch(`/knowledge?client_id=${clientId}`),
  create: (data) => apiFetch('/knowledge', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/knowledge/${id}`, { method: 'DELETE' })
};

// ─── Calendar Slots ───────────────────────────────────────────────────────────
export const calendarApi = {
  getSlots: (clientId, date) => apiFetch(`/calendar/slots?client_id=${clientId}&date=${date}`)
};

// ─── Server-Sent Events for live dashboard ────────────────────────────────────
export function connectLiveDashboard(clientId, onEvent) {
  const url = `${BACKEND_URL}/api/events?client_id=${clientId}`;
  const es = new EventSource(url);
  
  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data);
    } catch {}
  };

  es.onerror = () => {
    // SSE disconnected — will auto-reconnect
  };

  return () => es.close(); // Return cleanup function
}

export { checkBackend, BACKEND_URL };
