import express from 'express';
import pg from 'pg';

const pool = new pg.Pool({
  host: 'postgres-svc',
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10,
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectToDatabase() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const client = await pool.connect();
      console.log('Connected to database');
      client.release();
      return;
    } catch (error) {
      console.error(`Database connection failed (${retries + 1}/${maxRetries})`, error);
      retries++;
      await sleep(5000);
    }
  }
}

connectToDatabase()
  .then(() => {
    pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        task VARCHAR(140) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
  })
  .then(() => {
    console.log('Database initialized');
  })
  .catch(error => {
    console.error('Error connecting to database', error);
  });

const app = express();

const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT id, task, created_at AS "createdAt" FROM todos');
  const todos = result.rows;
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'Task is required' });
  }
  if (task.length > 140) {
    return res.status(400).json({ error: 'Task cannot be longer than 140 characters' });
  }
  const result = await pool.query(
    'INSERT INTO todos (task) VALUES ($1) RETURNING id, task, created_at AS "createdAt"',
    [task]
  );
  const todo = result.rows[0];
  res.status(201).json(todo);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
