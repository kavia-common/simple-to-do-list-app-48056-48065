import React, { useState } from 'react';
import Icon from './Icon';
import CheckCircleIcon from '../assets/icons/CheckCircleIcon';
import CircleIcon from '../assets/icons/CircleIcon';
import EditIcon from '../assets/icons/EditIcon';
import TrashIcon from '../assets/icons/TrashIcon';

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
      <button
        type="button"
        className="btn btn-icon btn-secondary"
        aria-label="Toggle complete"
        title="Toggle complete"
        onClick={() => onToggle(todo.id)}
      >
        <Icon size={22} className="icon">
          {todo.completed ? <CheckCircleIcon /> : <CircleIcon />}
        </Icon>
      </button>

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
          <Icon size={18} className="icon">
            <EditIcon />
          </Icon>
        </button>
        <button
          type="button"
          className="btn btn-icon btn-danger"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
          title="Delete task"
        >
          <Icon size={18} className="icon">
            <TrashIcon />
          </Icon>
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
