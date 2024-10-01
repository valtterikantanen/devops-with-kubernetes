import axios from 'axios';
import { useEffect, useState } from 'react';

import classes from './App.module.css';

type Todo = {
  id: string;
  task: string;
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

  return (
    <>
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
          <li key={todo.id}>{todo.task}</li>
        ))}
      </ul>
    </>
  );
}
