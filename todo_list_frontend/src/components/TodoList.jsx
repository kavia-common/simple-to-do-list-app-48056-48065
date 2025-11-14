import React from 'react';
import TodoItem from './TodoItem';

/**
 * PUBLIC_INTERFACE
 * Renders a list of todos with actions.
 */
function TodoList({ todos = [], onToggle, onDelete, onEdit }) {
  return (
    <ul className="list" role="list" aria-label="Task list">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
