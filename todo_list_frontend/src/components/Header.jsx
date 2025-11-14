import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Header with app title and theme toggle, shows online/offline mode.
 */
function Header({ title = 'To-Do', theme = 'light', onToggleTheme, onlineMode }) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <div className="brand" aria-label="Application">
          <div className="brand-badge" aria-hidden="true">✓</div>
          <h1 className="title">{title}</h1>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            className="muted"
            title={onlineMode ? 'Connected to backend' : 'Using local storage'}
            aria-live="polite"
          >
            {onlineMode ? 'Online' : 'Offline'}
          </span>
          <button
            type="button"
            className="btn theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
