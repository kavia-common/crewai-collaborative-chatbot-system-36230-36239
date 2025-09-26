import React, { useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessages from './components/ChatMessages';
import Composer from './components/Composer';
import Footer from './components/Footer';
import { useChat } from './context/ChatContext';

// PUBLIC_INTERFACE
export default function ChatView() {
  /** PUBLIC_INTERFACE: Main chat layout */
  const { createSession, messages, loading, error } = useChat();

  const handleNewSession = useCallback(async () => {
    const id = `sess-${Math.random().toString(36).slice(2, 10)}`;
    await createSession(id);
  }, [createSession]);

  return (
    <div className="app-shell">
      <Header onNewSession={handleNewSession} />
      <main className="main">
        <Sidebar />
        <section className="chat" aria-label="Chat area">
          <div className="chat-header">
            <div style={{ fontWeight: 700 }}>Conversation</div>
            <div className="agent-badges" aria-hidden>
              <span className="badge amber" title="Agent A (amber)">Agent A</span>
              <span className="badge blue" title="Agent B (blue)">Agent B</span>
            </div>
          </div>
          {error && (
            <div style={{ color: 'white', background: 'var(--color-error)', padding: 8, fontSize: 14 }}>
              {String(error)}
            </div>
          )}
          {loading && (
            <div style={{ padding: 12, color: 'var(--muted)' }}>
              Loading...
            </div>
          )}
          <ChatMessages items={messages} />
          <Composer />
        </section>
      </main>
      <Footer />
    </div>
  );
}
