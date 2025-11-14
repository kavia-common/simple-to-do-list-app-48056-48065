import React from 'react';
import Icon from './Icon';
import SunIcon from '../assets/icons/SunIcon';
import MoonIcon from '../assets/icons/MoonIcon';
import BellIcon from '../assets/icons/BellIcon';

/**
 * PUBLIC_INTERFACE
 * Header with app title and theme toggle, shows online/offline mode.
 */
function Header({ title = 'To-Do', theme = 'light', onToggleTheme, onlineMode }) {
  const nextMode = theme === 'light' ? 'dark' : 'light';

  // Placeholder notification count; if integrating later, wire to state/props.
  const notifications = 0;

  const badge = notifications > 0;

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <div className="brand" aria-label="Application">
          <div className="brand-badge" aria-hidden="true">✓</div>
          <h1 className="title">{title}</h1>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-icon btn-secondary"
            aria-label="Notifications"
            title="Notifications"
            // no-op click handler for now
            onClick={() => {}}
            style={{ position: 'relative' }}
          >
            <Icon size={18} className="icon" aria-hidden="true">
              <BellIcon />
            </Icon>
            {/* Subtle badge dot/count; accessible name via button aria-label */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                minWidth: badge ? 6 : 6,
                minHeight: badge ? 6 : 6,
                width: badge ? 'auto' : 6,
                height: badge ? 'auto' : 6,
                padding: badge ? '0 4px' : 0,
                borderRadius: 9999,
                background: 'var(--color-secondary)',
                color: '#0b1220',
                fontSize: 10,
                fontWeight: 700,
                lineHeight: badge ? '14px' : '6px',
                textAlign: 'center',
                boxShadow: '0 0 0 2px var(--color-surface)',
              }}
            >
              {badge ? Math.min(notifications, 9) : ''}
            </span>
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
