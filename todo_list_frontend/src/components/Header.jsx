import React from 'react';
import Icon from './Icon';
import SunIcon from '../assets/icons/SunIcon';
import MoonIcon from '../assets/icons/MoonIcon';
import BellIcon from '../assets/icons/BellIcon';
import { Link } from '../lib/router';

/**
 * PUBLIC_INTERFACE
 * Header with app title and theme toggle, shows online/offline mode.
 */
function Header({ title = 'To-Do', theme = 'light', onToggleTheme, onlineMode, incompleteCount = 0 }) {
  const nextMode = theme === 'light' ? 'dark' : 'light';

  const badge = Number(incompleteCount) > 0;
  const notifCount = Number(incompleteCount) || 0;

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner" style={{ color: '#ffffff' }}>
        <div className="brand" aria-label="Application" style={{ color: '#ffffff' }}>
          <div className="brand-badge" aria-hidden="true">✓</div>
          <h1 className="title">{title}</h1>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <nav aria-label="Sections" style={{ display: 'flex', gap: 8, marginRight: 8 }}>
            <Link to="#/" className="btn btn-secondary" ariaLabel="Go to Home" title="Home">Home</Link>
            <Link to="#/categories" className="btn btn-secondary" ariaLabel="Go to Categories" title="Categories">Categories</Link>
          </nav>
          <button
            type="button"
            className="btn btn-icon btn-secondary"
            aria-label={`Notifications: ${notifCount} pending tasks`}
            title={`Notifications: ${notifCount} pending tasks`}
            // no-op click handler for now
            onClick={() => {}}
            style={{ position: 'relative' }}
          >
            <Icon size={18} className="icon" aria-hidden="true">
              <BellIcon />
            </Icon>
            {badge ? (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  borderRadius: 9999,
                  background: 'var(--color-secondary)',
                  color: '#0b1220',
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: '16px',
                  textAlign: 'center',
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.9)',
                }}
              >
                {Math.min(notifCount, 99)}
              </span>
            ) : null}
          </button>

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
