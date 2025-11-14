import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Top navigation bar for filtering tasks and accessing Settings/About.
 * Provides accessible, keyboard-focusable controls with Ocean Professional styling.
 */
function NavBar({ activeFilter = 'all', onChangeFilter, onOpenSettings }) {
  const filters = [
    { key: 'all', label: 'All', aria: 'Show all tasks' },
    { key: 'active', label: 'Active', aria: 'Show active (incomplete) tasks' },
    { key: 'completed', label: 'Completed', aria: 'Show completed tasks' },
  ];

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-inner">
        <div className="brand" aria-label="Application">
          <div className="brand-badge" aria-hidden="true">✓</div>
          <h1 className="title">To-Do</h1>
        </div>

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
