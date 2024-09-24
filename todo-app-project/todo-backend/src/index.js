import { randomUUID } from 'crypto';
import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 3000;

const todos = [];

app.use(express.json());

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  const todo = { id: randomUUID(), task, createdAt: new Date().toISOString() };
  todos.push(todo);
  res.status(201).json(todo);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
