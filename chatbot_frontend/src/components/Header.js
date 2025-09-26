import React from 'react';

// PUBLIC_INTERFACE
export default function Header({ onNewSession }) {
  /** PUBLIC_INTERFACE: Top navigation bar with brand and actions */
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-badge" aria-hidden />
          <div>Ocean Chat</div>
        </div>
        <nav className="nav">
          <button className="btn" onClick={onNewSession} aria-label="Create new chat session">
            New Session
          </button>
          <a className="btn primary" href="https://github.com/" target="_blank" rel="noreferrer">
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
