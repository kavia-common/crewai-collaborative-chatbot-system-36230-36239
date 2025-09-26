import React from 'react';

// Simple agent role mapping to visual variants
function getVariant(msg) {
  if (msg.role === 'user') return 'user';
  // If agent_id or name exists, classify across two agents A/B consistently
  // Use id parity or name hash for deterministic styling
  if (msg.role === 'agent') {
    const key = (msg.agent_id ?? (msg.agent_name?.length || 1)) | 0;
    return key % 2 === 0 ? 'agentA' : 'agentB'; // A=amber, B=blue
  }
  return 'agentB';
}

// PUBLIC_INTERFACE
export function ChatMessage({ msg }) {
  /** PUBLIC_INTERFACE: Render a single message bubble */
  const variant = getVariant(msg);
  const alignEnd = variant === 'user';
  return (
    <div className={`msg ${variant}`} style={{ justifyContent: alignEnd ? 'flex-end' : 'flex-start' }}>
      <div className="bubble">
        <div className="role">
          {msg.role === 'user'
            ? 'You'
            : msg.agent_name
              ? `Agent ${msg.agent_name}`
              : variant === 'agentA'
                ? 'Agent A'
                : 'Agent B'}
          {' · '}
          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
        </div>
        <div className="content">{msg.content}</div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ChatMessages({ items }) {
  /** PUBLIC_INTERFACE: Render messages list */
  return (
    <div className="message-pane" aria-live="polite">
      {items.map(m => <ChatMessage key={m.id} msg={m} />)}
      {items.length === 0 && (
        <div style={{ color: 'var(--muted)', padding: 16 }}>
          Say hello to start the conversation.
        </div>
      )}
    </div>
  );
}
