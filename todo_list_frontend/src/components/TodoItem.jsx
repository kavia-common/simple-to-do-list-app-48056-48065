import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Single todo item with checkbox to toggle completion, text (editable), and delete button.
 */
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const submitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    }
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitEdit();
    } else if (e.key === 'Escape') {
      setDraft(todo.text);
      setEditing(false);
    }
  };

  return (
    <li className="todo-item" role="listitem">
      <input
        aria-label="Toggle complete"
        title="Toggle complete"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      {!editing ? (
        <div
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          onDoubleClick={() => setEditing(true)}
          title="Double click to edit"
        >
          {todo.text}
        </div>
      ) : (
        <input
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={onKeyDown}
          autoFocus
          aria-label="Edit task"
        />
      )}

      <div className="todo-actions">
        <button
          type="button"
          className="btn btn-icon btn-secondary"
          aria-label="Edit task"
          title="Edit"
          onClick={() => setEditing((v) => !v)}
        >
          ✎
        </button>
        <button
          type="button"
          className="btn btn-icon btn-danger"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
          title="Delete task"
        >
          🗑
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
