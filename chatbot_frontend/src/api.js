/**
 * Simple API client for the chatbot backend.
 * Uses environment variables:
 * - REACT_APP_API_BASE_URL (required)
 */
const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

function get(url, opts = {}) {
  return fetch(`${API_BASE}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    },
    credentials: 'include',
    ...opts
  }).then(res => {
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
    return res.json();
  });
}

function post(url, body = {}, opts = {}) {
  return fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    },
    body: JSON.stringify(body),
    credentials: 'include',
    ...opts
  }).then(res => {
    if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
    return res.json();
  });
}

// PUBLIC_INTERFACE
export const Api = {
  /** PUBLIC_INTERFACE: List sessions */
  sessionsList() {
    return get('/sessions/');
  },
  /** PUBLIC_INTERFACE: Create a session with session_id and optional title */
  sessionCreate(payload) {
    return post('/sessions/', payload);
  },
  /** PUBLIC_INTERFACE: Get session details */
  sessionGet(sessionId) {
    return get(`/sessions/${encodeURIComponent(sessionId)}/`);
  },
  /** PUBLIC_INTERFACE: Get session history (messages) */
  sessionHistory(sessionId) {
    return get(`/sessions/${encodeURIComponent(sessionId)}/history/`);
  },
  /** PUBLIC_INTERFACE: Send a new user message */
  sessionSend(sessionId, content) {
    return post(`/sessions/${encodeURIComponent(sessionId)}/send/`, { content });
  },
  /** PUBLIC_INTERFACE: Health check */
  health() {
    return get('/health/');
  }
};
