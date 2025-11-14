import React from 'react';
import Icon from './Icon';
import BellIcon from '../assets/icons/BellIcon';

/**
 * PUBLIC_INTERFACE
 * Top header with only search input and notifications button.
 *
 * Props:
 * - title: string (used for aria and placeholder context)
 * - searchQuery: string
 * - onSearchChange: (val) => void
 * - onClearSearch: () => void
 * - incompleteCount: number (for notification badge)
 */
function Header({
  title = 'To-Do',
  searchQuery = '',
  onSearchChange,
  onClearSearch,
  incompleteCount = 0,
}) {
  const notifCount = Number(incompleteCount) || 0;
  const badge = notifCount > 0;

  return (
    <header className="topbar" role="banner" aria-label={`${title} header`}>
      <div className="topbar-inner">
        <div className="topbar-left">
          <div className="brand-badge" aria-hidden="true">✓</div>
          <h1 className="title" style={{ color: 'inherit' }}>{title}</h1>
        </div>

        <div className="topbar-right">
          <div className="search-wrap" style={{ position: 'relative', minWidth: 220 }}>
            <input
              type="search"
              className="input search-input"
              aria-label="Search tasks"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{ paddingRight: searchQuery ? 32 : 12 }}
            />
            {searchQuery ? (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                title="Clear search"
                onClick={() => onClearSearch?.()}
              >
                ×
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className="btn btn-icon btn-secondary"
            aria-label={`Notifications: ${notifCount} pending tasks`}
            title={`Notifications: ${notifCount} pending tasks`}
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
        </div>
      </div>
    </header>
  );
}

export default Header;
