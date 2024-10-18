// src/app/hooks/useTodos.ts

import { useState, useEffect } from 'react';
import { Todo } from '../lib/types/types';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== 'undefined') {
      const storedTodos = localStorage.getItem('todos');
      try {
        return storedTodos ? JSON.parse(storedTodos) : [];
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
        return [];
      }
    }
    return []; 
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTodos = () => {
      if (typeof window !== 'undefined') {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
          try {
            setTodos(JSON.parse(storedTodos)); 
          } catch (error) {
            console.error('Failed to parse todos from localStorage:', error);
            setTodos([]);
          }
        }
      }
      setIsLoading(false); 
    };

    loadTodos(); 
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos)); 
    }
  }, [todos]); 

  // Updated to accept title, text, and importance
  const addTodo = (title: string, text: string, important?: boolean) => {
    const newTodo: Todo = { 
      id: Date.now().toString(), 
      title, 
      text, 
      completed: false,
      important: important ?? false
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
  };

  return {
    todos,
    addTodo,
    toggleTodoCompletion,
    deleteTodo,
    isLoading, 
  };
};

export default useTodos;
