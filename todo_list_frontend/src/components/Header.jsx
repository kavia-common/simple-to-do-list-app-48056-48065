import React from 'react';
import Icon from './Icon';
import SunIcon from '../assets/icons/SunIcon';
import MoonIcon from '../assets/icons/MoonIcon';

/**
 * PUBLIC_INTERFACE
 * Header with app title and theme toggle, shows online/offline mode.
 */
function Header({ title = 'To-Do', theme = 'light', onToggleTheme, onlineMode }) {
  const nextMode = theme === 'light' ? 'dark' : 'light';
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
            aria-label={`Switch to ${nextMode} mode`}
            title={`Switch to ${nextMode} mode`}
          >
            <Icon size={18} className="icon" aria-hidden="true">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </Icon>
            <span className="sr-only">{`Switch to ${nextMode} mode`}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
