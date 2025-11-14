import React from 'react';
import { Link } from '../lib/router';

/**
 * PUBLIC_INTERFACE
 * Vertical sidebar navigation and filters.
 * Ocean Professional styling with subtle gradient/shadow.
 *
 * Props:
 * - activeFilter: 'all' | 'active' | 'completed'
 * - onChangeFilter: (key) => void
 * - onOpenSettings: () => void
 */
function NavBar({
  activeFilter = 'all',
  onChangeFilter,
  onOpenSettings,
}) {
  const filters = [
    { key: 'all', label: 'All', aria: 'Show all tasks' },
    { key: 'active', label: 'Active', aria: 'Show active (incomplete) tasks' },
    { key: 'completed', label: 'Completed', aria: 'Show completed tasks' },
  ];

  return (
    <nav className="vertical-nav" aria-label="Primary">
      <div className="vertical-brand">
        <div className="vertical-badge" aria-hidden="true">✓</div>
        <div className="vertical-title">To‑Do</div>
      </div>

      <div className="vertical-section" aria-label="Sections">
        <Link to="#/" className="vertical-link" ariaLabel="Go to Home" title="Home">Home</Link>
        <Link to="#/categories" className="vertical-link" ariaLabel="Go to Categories" title="Categories">Categories</Link>
      </div>

      <div className="vertical-section" role="group" aria-label="Task filters">
        {filters.map((f) => {
          const selected = activeFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              className={`vertical-filter ${selected ? 'is-active' : ''}`}
              aria-pressed={selected}
              aria-label={f.aria}
              title={f.label}
              onClick={() => onChangeFilter?.(f.key)}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="vertical-footer">
        <button
          type="button"
          className="vertical-secondary"
          onClick={onOpenSettings}
          aria-label="Open settings and about"
          title="Settings / About"
        >
          Settings
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
