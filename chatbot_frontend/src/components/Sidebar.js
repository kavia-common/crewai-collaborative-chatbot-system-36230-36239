import React, { useMemo, useState } from 'react';
import { useChat } from '../context/ChatContext';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** PUBLIC_INTERFACE: Sidebar listing sessions with quick create */
  const { sessions, activeSessionId, selectSession, createSession } = useChat();
  const [title, setTitle] = useState('');

  const ordered = useMemo(() => {
    const arr = Array.isArray(sessions) ? [...sessions] : [];
    arr.sort((a, b) => (new Date(b.updated_at || b.created_at || 0).getTime()) - (new Date(a.updated_at || a.created_at || 0).getTime()));
    return arr;
  }, [sessions]);

  const handleQuickCreate = async () => {
    const id = `sess-${Math.random().toString(36).slice(2, 8)}`;
    await createSession(id, title.trim());
    setTitle('');
  };

  return (
    <aside className="sidebar" aria-label="Chat sessions">
      <div className="sidebar-header">
        <div style={{ fontWeight: 700 }}>Conversations</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Recent sessions</div>
      </div>
      <div style={{ padding: 8, display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
        <input
          type="text"
          placeholder="Optional title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ borderRadius: 10, border: '1px solid var(--border)', padding: 8, outline: 'none' }}
          aria-label="New session title"
        />
        <button className="btn" onClick={handleQuickCreate}>Create</button>
      </div>
      <div className="sidebar-list">
        {ordered.map(s => {
          const active = s.session_id === activeSessionId;
          return (
            <div
              key={s.session_id}
              className={`session-item ${active ? 'active' : ''}`}
              onClick={() => selectSession(s.session_id)}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="session-title">{s.title || s.session_id}</div>
                <div className="session-meta">
                  {new Date(s.updated_at || s.created_at || Date.now()).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="badge amber">A</span>
                <span className="badge blue">B</span>
              </div>
            </div>
          );
        })}
        {ordered.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: 14, padding: 8 }}>
            No sessions yet. Create one to start chatting.
          </div>
        )}
      </div>
    </aside>
  );
}
