import React from 'react';

// PUBLIC_INTERFACE
export default function Footer() {
  /** PUBLIC_INTERFACE: Footer with small info */
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Ocean Chat</span>
        <span>•</span>
        <span style={{ color: 'var(--muted)' }}>Dual-agent collaborative chatbot UI</span>
      </div>
    </footer>
  );
}
