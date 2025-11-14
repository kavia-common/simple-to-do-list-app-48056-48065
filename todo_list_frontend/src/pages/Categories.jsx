import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';
import Icon from '../components/Icon';
import PlusIcon from '../assets/icons/PlusIcon';
import EditIcon from '../assets/icons/EditIcon';
import TrashIcon from '../assets/icons/TrashIcon';

/**
 * PUBLIC_INTERFACE
 * Categories page: list, add, rename, delete categories.
 * Persistence via local storage key "categories".
 */
function Categories({ todos = [] }) {
  const { categories, counts, addCategory, renameCategory, deleteCategory } = useCategories(todos);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  const onAdd = () => {
    const val = newName.trim();
    if (!val) return;
    const created = addCategory(val);
    if (created) setNewName('');
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setDraft(cat.name);
  };

  const commitEdit = () => {
    const val = draft.trim();
    if (editingId && val) {
      renameCategory(editingId, val);
    }
    setEditingId(null);
  };

  const onKeyDownNew = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  const onKeyDownEdit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <main className="container" role="main" aria-label="Categories management">
      <section className="section card">
        <CardHeader title="Categories" subtitle="Organize your tasks by category" />
        <CardBody>
          <div className="input-row" role="form" aria-label="Add a new category">
            <input
              aria-label="Category name"
              className="input"
              type="text"
              placeholder="Add a new category..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={onKeyDownNew}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAdd}
              aria-label="Add category"
            >
              <Icon size={18} className="icon" aria-hidden="true">
                <PlusIcon />
              </Icon>
              <span className="btn-text">Add</span>
            </button>
          </div>

          <div className="section">
            <h3 className="subtitle">Your Categories</h3>
            <ul className="list" role="list" aria-label="Category list">
              {categories.map((c) => {
                const count = counts?.get(c.id) || 0;
                const isEditing = editingId === c.id;
                return (
                  <li key={c.id} className="todo-item" role="listitem" style={{ gridTemplateColumns: '1fr auto' }}>
                    {!isEditing ? (
                      <div className="todo-text">
                        <strong>{c.name}</strong>
                        <span className="muted" style={{ marginLeft: 8 }}>({count} tasks)</span>
                      </div>
                    ) : (
                      <input
                        className="input"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={onKeyDownEdit}
                        autoFocus
                        aria-label="Edit category name"
                      />
                    )}

                    <div className="todo-actions">
                      <button
                        type="button"
                        className="btn btn-icon btn-secondary"
                        aria-label="Rename category"
                        title="Rename"
                        onClick={() => (isEditing ? commitEdit() : startEdit(c))}
                      >
                        <Icon size={18} className="icon">
                          <EditIcon />
                        </Icon>
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-danger"
                        onClick={() => deleteCategory(c.id)}
                        aria-label="Delete category"
                        title="Delete category"
                      >
                        <Icon size={18} className="icon">
                          <TrashIcon />
                        </Icon>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {categories.length === 0 && (
              <p className="empty-state" aria-live="polite">
                No categories yet. Create your first category above.
              </p>
            )}
          </div>
        </CardBody>
        <CardFooter>
          Tip: Categories are saved locally in your browser.
        </CardFooter>
      </section>
    </main>
  );
}

export default Categories;
