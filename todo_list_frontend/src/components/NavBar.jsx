import React from 'react';
import Icon from './Icon';
import BellIcon from '../assets/icons/BellIcon';

/**
 * PUBLIC_INTERFACE
 * Top navigation bar for filtering tasks and accessing Settings/About.
 * Provides accessible, keyboard-focusable controls with Ocean Professional styling.
 *
 * Props:
 * - activeFilter: 'all' | 'active' | 'completed'
 * - onChangeFilter: (key) => void
 * - onOpenSettings: () => void
 * - searchQuery: string
 * - onSearchChange: (value) => void
 * - onClearSearch: () => void
 */
function NavBar({ activeFilter = 'all', onChangeFilter, onOpenSettings, searchQuery = '', onSearchChange, onClearSearch }) {
  const filters = [
    { key: 'all', label: 'All', aria: 'Show all tasks' },
    { key: 'active', label: 'Active', aria: 'Show active (incomplete) tasks' },
    { key: 'completed', label: 'Completed', aria: 'Show completed tasks' },
  ];

  // Optional badge state; not wired to data yet
  const notifications = 0;
  const badge = notifications > 0;

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-inner" style={{ gap: 12 }}>
        <div className="brand" aria-label="Application">
          <div className="brand-badge" aria-hidden="true">✓</div>
          <h1 className="title">To-Do</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
          {/* Filters */}
          <div role="group" aria-label="Task filters" style={{ display: 'flex', gap: 8 }}>
            {filters.map((f) => {
              const selected = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  className="btn btn-secondary"
                  aria-pressed={selected}
                  aria-label={f.aria}
                  onClick={() => onChangeFilter?.(f.key)}
                  title={f.label}
                  style={{
                    ...(selected
                      ? {
                          borderColor: 'rgba(37,99,235,0.4)',
                          background: 'rgba(37,99,235,0.12)',
                          color: 'var(--color-primary)',
                        }
                      : {}),
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="search-wrap" style={{ position: 'relative', minWidth: 180 }}>
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

          {/* Notifications */}
          <button
            type="button"
            className="btn btn-icon btn-secondary"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => {}}
            style={{ position: 'relative' }}
          >
            <Icon size={18} className="icon" aria-hidden="true">
              <BellIcon />
            </Icon>
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

          {/* Settings */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenSettings}
            aria-label="Open settings and about"
            title="Settings / About"
          >
            Settings
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
