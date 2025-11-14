import React, { useEffect, useMemo, useState, useMemo as useReactMemo } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import WelcomeBanner from './components/WelcomeBanner';
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
      />

      {/* New top navigation with filters, search, and settings */}
      <NavBar
        activeFilter={filter}
        onChangeFilter={setFilter}
        onOpenSettings={openSettings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* Friendly welcome banner; becomes compact when there are tasks */}
      <div className="container">
        <WelcomeBanner hasTasks={Array.isArray(filteredTodos) && filteredTodos.length > 0} />
      </div>

      <main className="container" role="main" aria-label="To-do application">
        <section className="section card">
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
        </section>

        <section className="section card">
          <div className="list-header">
            <h2 className="subtitle">Your Tasks</h2>
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
