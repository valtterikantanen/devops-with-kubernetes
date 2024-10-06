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
  .then(() =>
    pool.query('CREATE TABLE IF NOT EXISTS pongs (id SERIAL PRIMARY KEY, count INT NOT NULL)')
  )
  .then(() => pool.query('SELECT count FROM pongs WHERE id = 1'))
  .then(result => {
    if (result.rows.length === 0) {
      return pool.query('INSERT INTO pongs (count) VALUES (0)');
    }
  })
  .then(() => {
    console.log('Database initialized');
  })
  .catch(error => {
    console.error('Error connecting to database', error);
  });

const app = express();

const PORT = process.env.PORT ?? 3000;

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
    console.error('Health check failed:', error);
    res.status(500).end();
  }
});

app.get('/pingpong', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE pongs SET count = count + 1 WHERE id = 1 RETURNING count'
    );
    const counter = result.rows[0].count;
    res.send(`pong ${counter}`);
  } catch (error) {
    console.error('Error handling /pingpong:', error);
    res.status(500).end();
  }
});

app.get('/pongs', async (req, res) => {
  try {
    const result = await pool.query('SELECT count FROM pongs WHERE id = 1');
    const counter = result.rows[0].count;
    res.json({ counter });
  } catch (error) {
    console.error('Error handling /pongs:', error);
    res.status(500).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
