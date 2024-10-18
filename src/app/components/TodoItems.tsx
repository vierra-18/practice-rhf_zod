// src/app/components/TodoItems.tsx

import React from 'react';
import { Todo } from '../lib/types/types'; // Import the Todo type

interface TodoItemsProps {
  todos: Todo[]; // Array of Todo items
  onToggleTodo: (id: string) => void; // Function to toggle completion
  onDeleteTodo: (id: string) => void; // Function to delete a todo
}

const TodoItems: React.FC<TodoItemsProps> = ({ todos, onToggleTodo, onDeleteTodo }) => {
  return (
    <div>
      <h2>Your Todos</h2>
      {todos.length === 0 ? (
        <p>No todos available</p> // Message when there are no todos
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id} className={`mb-1 px-3 ${todo.important?"border-l-4 border-red-600":""}`}>
              <h3>{todo.title}</h3> {/* Display title */}
              <p>{todo.text}</p> {/* Display description */}
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggleTodo(todo.id)} // Toggle completion
                />
                Completed
              </label>
              <button onClick={() => onDeleteTodo(todo.id)}>Delete</button> {/* Delete button */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoItems;
