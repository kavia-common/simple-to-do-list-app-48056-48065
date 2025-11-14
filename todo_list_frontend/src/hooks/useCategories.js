import { useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from '../lib/storage';

const CATEGORIES_KEY = 'categories';

/**
 * PUBLIC_INTERFACE
 * Hook to manage task categories locally.
 * Provides list, add, rename, remove and counts (if tasks provided).
 */
export function useCategories(allTodos = []) {
  const [categories, setCategories] = useState(() => {
    return normalize(storage.get(CATEGORIES_KEY, []));
  });

  // Persist whenever categories change
  useEffect(() => {
    storage.set(CATEGORIES_KEY, categories);
  }, [categories]);

  // Optional counts derived from provided todos
  const counts = useMemo(() => {
    const map = new Map();
    for (const c of categories) map.set(c.id, 0);
    for (const t of (Array.isArray(allTodos) ? allTodos : [])) {
      const cid = t?.categoryId || null;
      if (cid && map.has(cid)) map.set(cid, (map.get(cid) || 0) + 1);
    }
    return map;
  }, [categories, allTodos]);

  const addCategory = useCallback((name) => {
    const text = String(name || '').trim();
    if (!text) return null;
    const exists = categories.some((c) => c.name.toLowerCase() === text.toLowerCase());
    if (exists) return null;
    const cat = { id: makeId(), name: text, createdAt: Date.now() };
    setCategories((prev) => [cat, ...prev]);
    return cat;
  }, [categories]);

  const renameCategory = useCallback((id, newName) => {
    const text = String(newName || '').trim();
    if (!id || !text) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: text } : c))
    );
  }, []);

  const deleteCategory = useCallback((id) => {
    if (!id) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Note: tasks currently won't auto-update; integration with tasks can be added later.
  }, []);

  return {
    categories,
    counts,
    addCategory,
    renameCategory,
    deleteCategory,
  };
}

function normalize(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((c) => ({
      id: String(c?.id || ''),
      name: String(c?.name || '').trim(),
      createdAt: Number(c?.createdAt || Date.now()),
    }))
    .filter((c) => c.id && c.name);
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'cat_' + Math.random().toString(36).slice(2, 10);
}
