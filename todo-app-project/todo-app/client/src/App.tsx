import axios from 'axios';
import { useEffect, useState } from 'react';

import classes from './App.module.css';

type Todo = {
  id: string;
  task: string;
  completed: boolean;
  createdAt: string;
};

export default function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setImageSrc('/assets/images/image.jpg');
    axios.get('/todos').then(response => {
      setTodos(response.data);
    });
  }, []);

  function handleCreateTodo(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    axios.post('/todos', { task: newTodo }).then(response => {
      setTodos(prevTodos => [...prevTodos, response.data]);
      setNewTodo('');
    });
  }

  function handleUpdateTodoStatus(todo: Todo) {
    axios.put(`/todos/${todo.id}`, { completed: !todo.completed }).then(response => {
      setTodos(prevTodos => prevTodos.map(t => (t.id === todo.id ? response.data : t)));
    });
  }

  return (
    <>
      <h1>Todo App</h1>
      <img src={imageSrc} width="400" height="400" />
      <form className={classes.todoInputForm}>
        <input
          type="text"
          maxLength={140}
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
        />
        <button type="submit" onClick={handleCreateTodo}>
          Create Todo
        </button>
      </form>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            onClick={() => handleUpdateTodoStatus(todo)}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
          >
            {todo.task}
          </li>
        ))}
      </ul>
    </>
  );
}
