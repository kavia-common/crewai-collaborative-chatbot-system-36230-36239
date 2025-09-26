import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

// PUBLIC_INTERFACE
export default function Composer() {
  /** PUBLIC_INTERFACE: Input area to send user messages */
  const { sendMessage, activeSessionId } = useChat();
  const [text, setText] = useState('');

  const handleSend = async () => {
    const t = text.trim();
    if (!t || !activeSessionId) return;
    setText('');
    await sendMessage(t);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="composer">
      <div className="composer-inner">
        <textarea
          placeholder={activeSessionId ? "Type your message... (Ctrl/Cmd+Enter to send)" : "Create or select a session to start"}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!activeSessionId}
          aria-label="Message input"
        />
        <button className="btn send" onClick={handleSend} disabled={!activeSessionId}>
          Send →
        </button>
      </div>
    </div>
  );
}
