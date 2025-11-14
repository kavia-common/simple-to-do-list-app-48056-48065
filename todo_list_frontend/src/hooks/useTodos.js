import { useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from '../lib/storage';
import { isApiEnabled, fetchTodos as apiFetch, createTodo as apiCreate, updateTodo as apiUpdate, deleteTodo as apiDelete } from '../lib/api';

const STORAGE_KEY = storage.nsKey();

/**
 * PUBLIC_INTERFACE
 * Hook to manage todos with persistence. Uses backend if configured; otherwise localStorage.
 */
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [onlineMode, setOnlineMode] = useState(isApiEnabled());
  const [loading, setLoading] = useState(onlineMode);
  const [error, setError] = useState(null);

  // load initial data
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setError(null);
      if (onlineMode) {
        setLoading(true);
        try {
          const remote = await apiFetch();
          if (!cancelled) {
            setTodos(normalize(remote));
            storage.set(STORAGE_KEY, normalize(remote)); // cache locally for offline
          }
        } catch (e) {
          if (!cancelled) {
            // fallback to local
            const local = storage.get(STORAGE_KEY, []);
            setTodos(normalize(local));
            setOnlineMode(false);
            setError('Network unavailable. Using local data.');
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        const local = storage.get(STORAGE_KEY, []);
        setTodos(normalize(local));
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [onlineMode]);

  // persist to localStorage on changes
  useEffect(() => {
    storage.set(STORAGE_KEY, todos);
  }, [todos]);

  const addTask = useCallback(async (text) => {
    const newTodo = {
      id: cryptoId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);

    if (onlineMode) {
      try {
        const created = await apiCreate(newTodo);
        // replace temp with server copy if it has different id/fields
        setTodos((prev) => {
          const idx = prev.findIndex((t) => t.id === newTodo.id);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = { ...newTodo, ...(created || {}) };
            return copy;
          }
          return prev;
        });
      } catch (e) {
        setOnlineMode(false);
        setError('Network error. Changes saved locally.');
      }
    }
  }, [onlineMode]);

  const toggleTask = useCallback(async (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    if (onlineMode) {
      try {
        const target = todos.find((t) => t.id === id);
        await apiUpdate(id, { completed: !target?.completed });
      } catch (e) {
        setOnlineMode(false);
        setError('Network error. Changes saved locally.');
      }
    }
  }, [onlineMode, todos]);

  const deleteTask = useCallback(async (id) => {
    const prevSnapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (onlineMode) {
      try {
        await apiDelete(id);
      } catch (e) {
        // revert locally if needed? keep removed since local is source now
        setOnlineMode(false);
        setError('Network error. Changes saved locally.');
        // ensure item remains deleted locally
        storage.set(STORAGE_KEY, prevSnapshot.filter((t) => t.id !== id));
      }
    }
  }, [onlineMode, todos]);

  const clearCompleted = useCallback(async () => {
    const next = todos.filter((t) => !t.completed);
    setTodos(next);
    if (onlineMode) {
      try {
        // naive approach: delete individually
        await Promise.all(
          todos.filter((t) => t.completed).map((t) => apiDelete(t.id).catch(() => null)),
        );
      } catch (e) {
        setOnlineMode(false);
        setError('Network error. Changes saved locally.');
      }
    }
  }, [onlineMode, todos]);

  const editTask = useCallback(async (id, newText) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: newText } : t)));
    if (onlineMode) {
      try {
        await apiUpdate(id, { text: newText });
      } catch (e) {
        setOnlineMode(false);
        setError('Network error. Changes saved locally.');
      }
    }
  }, [onlineMode]);

  return {
    todos,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    editTask,
    loading,
    error,
    onlineMode,
  };
}

function normalize(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((t) => ({
      id: String(t.id ?? ''),
      text: String(t.text ?? ''),
      completed: !!t.completed,
      createdAt: Number(t.createdAt ?? Date.now()),
    }))
    .filter((t) => t.id && t.text);
}

function cryptoId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Math.random().toString(36).slice(2, 10);
}
