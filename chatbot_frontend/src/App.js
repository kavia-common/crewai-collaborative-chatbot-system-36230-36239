import React, { useEffect, useState } from 'react';
import './theme.css';
import { ChatProvider } from './context/ChatContext';
import ChatView from './ChatView';

// PUBLIC_INTERFACE
function App() {
  /**
   * PUBLIC_INTERFACE: Entry point that applies theme and provides chat context
   */
  const [theme, setTheme] = useState(process.env.REACT_APP_THEME || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ChatProvider>
      <ChatView />
    </ChatProvider>
  );
}

export default App;
