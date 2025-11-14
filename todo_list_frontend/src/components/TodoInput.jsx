import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Input for adding new tasks with button and Enter key support.
 */
function TodoInput({ onAdd, disabled = false }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="input-row" role="form" aria-label="Add a new task">
      <input
        aria-label="Task text"
        className="input"
        type="text"
        placeholder="Add a new task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleAdd}
        aria-label="Add task"
        disabled={disabled}
      >
        Add
      </button>
    </div>
  );
}

export default TodoInput;
