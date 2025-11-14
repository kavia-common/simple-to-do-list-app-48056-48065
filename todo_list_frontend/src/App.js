import React, { useEffect, useMemo, useState, useMemo as useReactMemo } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import ProgressStats from './components/ProgressStats';
import WelcomeBanner from './components/WelcomeBanner';
import Card, { CardHeader, CardBody, CardFooter } from './components/Card';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { storage } from './lib/storage';

/**
 * Root App component rendering the header, input, and list.
 * Applies Ocean Professional theme and persists theme preference.
 */
// PUBLIC_INTERFACE
function App() {
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = useMemo(() => storage.get('kavia_theme_pref', prefersDark ? 'dark' : 'light'), [prefersDark]);
  const [theme, setTheme] = useState(initialTheme);

  // initialize todos hook (auto decides between local or API)
  const {
    todos,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    editTask,
    loading,
    error,
    onlineMode,
    stats,
    incompleteCount,
  } = useTodos();

  // Apply and persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.set('kavia_theme_pref', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Filter state for visible list: 'all' | 'active' | 'completed'
  const [filter, setFilter] = useState('all');

  // Search query state for text filtering
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = useReactMemo(() => {
    if (!Array.isArray(todos)) return [];
    // First apply status filter
    let byStatus = todos;
    switch (filter) {
      case 'active':
        byStatus = todos.filter((t) => !t.completed);
        break;
      case 'completed':
        byStatus = todos.filter((t) => t.completed);
        break;
      case 'all':
      default:
        byStatus = todos;
        break;
    }
    // Then apply text search (case-insensitive, trims whitespace)
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter((t) => (t.text || '').toLowerCase().includes(q));
  }, [todos, filter, searchQuery]);

  const openSettings = () => {
    // Stub action for Settings/About; accessible and non-blocking
    // eslint-disable-next-line no-alert
    alert('Settings/About coming soon.');
  };

  return (
    <div className="App ocean-app">
      {/* Preserve existing Header for theme toggle and online indicator */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        title="To-Do"
        onlineMode={onlineMode}
        incompleteCount={incompleteCount}
      />

      {/* New top navigation with filters, search, and settings */}
      <NavBar
        activeFilter={filter}
        onChangeFilter={setFilter}
        onOpenSettings={openSettings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        incompleteCount={incompleteCount}
      />

      {/* Progress summary and welcome banner */}
      <div className="container">
        <ProgressStats stats={stats} />
        <WelcomeBanner hasTasks={Array.isArray(filteredTodos) && filteredTodos.length > 0} />

        {/* Informational cards */}
        <div className="cards-grid" role="region" aria-label="Helpful information">
          {/* Quick Tips */}
          <Card role="article" ariaLabel="Quick tips card">
            <CardHeader title="Quick Tips" subtitle="Helpful shortcuts for faster entry" />
            <CardBody>
              <ul className="list" role="list" aria-label="Tips">
                <li style={{ padding: '6px 0' }}>
                  • Press Enter to add a task after typing in the input.
                </li>
                <li style={{ padding: '6px 0' }}>
                  • Use the filter buttons to switch between All, Active, and Completed.
                </li>
                <li style={{ padding: '6px 0' }}>
                  • Double‑click a task to edit. Press Enter to save, Esc to cancel.
                </li>
                <li style={{ padding: '6px 0' }}>
                  • If a search is available, try typing in the search bar to quickly find tasks.
                </li>
              </ul>
            </CardBody>
          </Card>

          {/* Today's Snapshot */}
          <Card role="article" ariaLabel="Today’s snapshot card">
            <CardHeader title="Today’s Snapshot" subtitle="Your current progress" />
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="card stat" aria-live="polite" style={{ padding: 12, borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                  <div className="muted" style={{ fontSize: 13 }}>Created Today</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{stats?.todayTotal || 0}</div>
                </div>
                <div className="card stat" aria-live="polite" style={{ padding: 12, borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                  <div className="muted" style={{ fontSize: 13 }}>Completed Today</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{stats?.todayCompleted || 0}</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Today’s Completion</div>
                <div className="progress-bar" role="progressbar" aria-label="Today completion progress"
                  aria-valuemin={0}
                  aria-valuemax={(stats?.todayTotal || 0)}
                  aria-valuenow={(stats?.todayCompleted || 0)}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        (stats?.todayTotal || 0) > 0
                          ? Math.min(100, Math.round(((stats?.todayCompleted || 0) / (stats?.todayTotal || 1)) * 100))
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter>
              Keep going! Small steps add up over the day.
            </CardFooter>
          </Card>

          {/* Shortcuts / About */}
          <Card role="article" ariaLabel="Shortcuts and About card">
            <CardHeader title="Shortcuts & About" subtitle="Learn more" />
            <CardBody>
              <p style={{ marginTop: 0 }}>
                This lightweight to‑do app uses the Ocean Professional theme for a clean, accessible UI.
              </p>
              <ul className="list" role="list" aria-label="Shortcuts">
                <li style={{ padding: '6px 0' }}>• Tab to navigate controls.</li>
                <li style={{ padding: '6px 0' }}>• Space/Enter to activate buttons.</li>
                <li style={{ padding: '6px 0' }}>• Clear Completed to tidy up finished tasks.</li>
              </ul>
            </CardBody>
            <CardFooter>
              Version 0.1 • Modern, responsive, and accessible by design
            </CardFooter>
          </Card>
        </div>
      </div>

      <main className="container" role="main" aria-label="To-do application">
        <section className="section card">
          <div className="card-body">
            <TodoInput onAdd={addTask} disabled={loading} />
            {error && (
              <div className="banner banner-error" role="status" aria-live="polite">
                {error}
              </div>
            )}
            {loading && (
              <div className="banner banner-info" role="status" aria-live="polite">
                Loading tasks...
              </div>
            )}
          </div>
        </section>

        <section className="section card">
          <header className="card-header" aria-label="Task list header">
            <div className="card-header-main">
              <h2 className="card-title">Your Tasks</h2>
            </div>
            <div className="card-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearCompleted}
                aria-label="Clear completed tasks"
                title="Clear completed"
              >
                Clear Completed
              </button>
            </div>
          </header>

          <div className="card-body">
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />

            {(!filteredTodos || filteredTodos.length === 0) && !loading && (
              <p className="empty-state" aria-live="polite">
                {searchQuery
                  ? 'No tasks match your search.'
                  : filter === 'completed'
                  ? 'No completed tasks.'
                  : filter === 'active'
                  ? 'No active tasks.'
                  : 'You don’t have any tasks yet. Add your first task above.'}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="muted">
          {onlineMode ? 'Online sync enabled' : 'Offline mode'} • Ocean Professional Theme
        </p>
      </footer>
    </div>
  );
}

export default App;
