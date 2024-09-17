import { randomUUID } from 'crypto';
import express from 'express';

const randomString = randomUUID();

function getCurrentStatus() {
  return `${new Date().toISOString()}: ${randomString}`;
}

function logRandomString() {
  console.log(getCurrentStatus());
  setTimeout(logRandomString, 5000);
}

const app = express();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

logRandomString();

app.get('/', (req, res) => {
  res.send(getCurrentStatus());
});
