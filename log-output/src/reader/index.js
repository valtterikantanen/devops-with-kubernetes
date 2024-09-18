import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';
import express from 'express';

const randomString = randomUUID();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCurrentStatus() {
  const filePath = join(import.meta.dirname, 'files', 'timestamp.txt');
  try {
    const timeStamp = await readFile(filePath, { encoding: 'utf-8' });
    return `${timeStamp}: ${randomString}`;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${filePath}`);
    } else {
      console.error('Failed to read timestamp:', error);
    }
    return null;
  }
}

async function logRandomString() {
  const currentStatus = await getCurrentStatus();
  if (currentStatus) {
    console.log(currentStatus);
  }
}

const app = express();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

app.get('/', async (req, res) => {
  const currentStatus = await getCurrentStatus();
  res.send(currentStatus);
});

while (true) {
  await logRandomString();
  await sleep(5000);
}
