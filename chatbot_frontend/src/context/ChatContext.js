/* Basic state management using React Context */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Api } from '../api';
import { openSessionSocket } from '../ws';

// Shape Helpers
const normalizeMessages = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map(m => ({
      id: m.id ?? `${m.role}-${Math.random().toString(36).slice(2)}`,
      role: m.role,
      content: m.content || '',
      // Two agents differentiation: if agent info exists, classify as A (amber) or B (blue) by order or id parity
      agent_id: m.agent_id ?? null,
      agent_name: m.agent?.name ?? null,
      created_at: m.created_at ? new Date(m.created_at) : new Date(),
    }))
    .sort((a, b) => (a.created_at?.getTime?.() || 0) - (b.created_at?.getTime?.() || 0));
};

// PUBLIC_INTERFACE
export const ChatContext = createContext({
  sessions: [],
  activeSessionId: null,
  messages: [],
  loading: false,
  error: null,
  createSession: async (_sessionId, _title) => {},
  selectSession: async (_sessionId) => {},
  sendMessage: async (_content) => {},
  refreshSessions: async () => {},
});

// PUBLIC_INTERFACE
export function useChat() {
  /** PUBLIC_INTERFACE: Hook to access chat store */
  return useContext(ChatContext);
}

// PUBLIC_INTERFACE
export function ChatProvider({ children }) {
  /**
   * PUBLIC_INTERFACE: Provider to manage chat sessions, history, and websocket
   */
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);

  // initial load
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Api.health().catch(() => ({}));
        const s = await Api.sessionsList().catch(() => []);
        setSessions(s || []);
        // Auto select the first session if exists
        if ((s || []).length > 0) {
          const first = (s || [])[0];
          await handleSelectSession(first.session_id);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setError(e.message || String(e));
        setLoading(false);
      }
    })();
    // cleanup ws when provider unmounts
    return () => {
      try { wsRef.current && wsRef.current.close(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWs = async (sessionId) => {
    if (!sessionId) return;
    // close previous
    try { wsRef.current && wsRef.current.close(); } catch {}
    wsRef.current = openSessionSocket(
      sessionId,
      // onMessage
      (data) => {
        // Expecting streaming tokens or batch messages; handle both
        if (Array.isArray(data)) {
          setMessages(prev => normalizeMessages([...prev, ...data]));
        } else if (data && (data.role || data.content)) {
          setMessages(prev => normalizeMessages([...prev, data]));
        }
      },
      // onOpen
      () => {},
      // onClose
      () => {},
      // onError
      () => {}
    );
  };

  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setLoading(true);
    setError(null);
    try {
      const history = await Api.sessionHistory(sessionId);
      setMessages(normalizeMessages(history?.messages || history || []));
      await connectWs(sessionId);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionId, title = '') => {
    setLoading(true);
    setError(null);
    try {
      const payload = { session_id: sessionId, ...(title ? { title } : {}) };
      await Api.sessionCreate(payload);
      const s = await Api.sessionsList();
      setSessions(s || []);
      await handleSelectSession(sessionId);
    } catch (e) {
      setError(e.message || String(e));
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    if (!activeSessionId || !content?.trim()) return;
    try {
      // Optimistically add user message
      const optimistic = {
        id: `local-${Date.now()}`,
        role: 'user',
        content,
        created_at: new Date(),
      };
      setMessages(prev => normalizeMessages([...prev, optimistic]));
      await Api.sessionSend(activeSessionId, content);
      // Agent replies will arrive on websocket; nothing else needed here.
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const refreshSessions = async () => {
    try {
      const s = await Api.sessionsList();
      setSessions(s || []);
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const value = useMemo(
    () => ({
      sessions,
      activeSessionId,
      messages,
      loading,
      error,
      createSession,
      selectSession: handleSelectSession,
      sendMessage,
      refreshSessions,
    }),
    [sessions, activeSessionId, messages, loading, error]
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
