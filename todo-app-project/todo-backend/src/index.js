import express from 'express';
import morgan from 'morgan';
import pg from 'pg';
import { connect, JSONCodec } from 'nats';

import { logger } from './util/logger.js';

const pool = new pg.Pool({
  host: 'postgres-svc',
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10,
});

const nc = await connect({ servers: 'nats://my-nats.default.svc.cluster.local:4222' });
const jc = JSONCodec();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectToDatabase() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const client = await pool.connect();
      logger.info('Connected to database');
      client.release();
      return;
    } catch (error) {
      logger.error(`Database connection failed (${retries + 1}/${maxRetries})`, error);
      retries++;
      await sleep(5000);
    }
  }
}

async function initializeDatabase() {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        task VARCHAR(140) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(
      'ALTER TABLE todos ADD COLUMN IF NOT EXISTS completed BOOLEAN NOT NULL DEFAULT FALSE'
    );
  } catch (error) {
    logger.error('Error initializing database', error);
    throw error;
  }
}

connectToDatabase()
  .then(() => initializeDatabase())
  .then(() => {
    logger.info('Database initialized');
  })
  .catch(error => {
    logger.error('Error connecting to database', error);
  });

const app = express();

const PORT = process.env.PORT ?? 3000;

morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status - :body - :req[content-length] - :response-time ms'));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Service is running');
});

app.get('/healthz', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    if (result) {
      res.status(200).end();
    } else {
      throw new Error('Database health check failed');
    }
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).end();
  }
});

app.get('/todos', async (req, res) => {
  const result = await pool.query(
    'SELECT id, task, completed, created_at AS "createdAt" FROM todos'
  );
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
    'INSERT INTO todos (task) VALUES ($1) RETURNING id, task, completed, created_at AS "createdAt"',
    [task]
  );
  const todo = result.rows[0];

  const msg = { type: 'todo_created', payload: todo };
  nc.publish('todo-events', jc.encode(msg));

  res.status(201).json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const completed = req.body.completed;
  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }
  try {
    const result = await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id, task, completed, created_at AS "createdAt"',
      [completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    const todo = result.rows[0];

    const msg = { type: 'todo_updated', payload: todo };
    nc.publish('todo-events', jc.encode(msg));

    return res.json(todo);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  logger.info(`Server started in port ${PORT}`);
});
