/**
 * WebSocket helper for receiving real-time updates per session.
 * URL shape: ws/chat/<session_id>/ (based on backend description)
 * Env vars:
 * - REACT_APP_WS_BASE_URL (optional, else derived from API base)
 * - REACT_APP_API_BASE_URL (fallback for deriving ws host)
 */

// Try to build a sensible WS base if not provided
function deriveWsBase() {
  const explicit = process.env.REACT_APP_WS_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const api = process.env.REACT_APP_API_BASE_URL || window.location.origin;
  try {
    const u = new URL(api);
    const scheme = u.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${scheme}//${u.host}`;
  } catch (e) {
    // Fallback to same host as current page
    const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${scheme}//${window.location.host}`;
  }
}

const WS_BASE = deriveWsBase();

// PUBLIC_INTERFACE
export function openSessionSocket(sessionId, onMessage, onOpen, onClose, onError) {
  /**
   * PUBLIC_INTERFACE: Open a WebSocket for a given session
   * - sessionId: string
   * - onMessage: (data: any) => void
   * Returns a WebSocket instance.
   */
  const url = `${WS_BASE}/ws/chat/${encodeURIComponent(sessionId)}/`;
  const ws = new WebSocket(url);
  ws.onopen = () => onOpen && onOpen();
  ws.onclose = (ev) => onClose && onClose(ev);
  ws.onerror = (err) => onError && onError(err);
  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      onMessage && onMessage(data);
    } catch {
      onMessage && onMessage(ev.data);
    }
  };
  return ws;
}
