// src/app/components/TodoList.tsx

"use client";

import React from 'react';
import useTodos from '../hooks/useTodos';
import TodoForm from './TodoForm';
import TodoItems from './TodoItems';

const TodoList: React.FC = () => {
  const { todos, addTodo, toggleTodoCompletion, deleteTodo, isLoading } = useTodos();

  if (isLoading) {
    return <div>Loading...</div>; // Show loading message
  }

  return (
    <div className='-2 w-full px-[6vh]'>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} /> {/* Pass addTodo to the TodoForm */}
      <TodoItems 
        todos={todos} 
        onToggleTodo={toggleTodoCompletion} 
        onDeleteTodo={deleteTodo} 
      /> {/* Pass necessary functions to TodoItems */}
    </div>
  );
};

export default TodoList;
