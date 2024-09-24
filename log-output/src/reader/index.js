import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';
import axios from 'axios';
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

async function getPingPongCounter() {
  try {
    const response = await axios.get('http://ping-pong-svc:2345/pongs');
    return response.data.counter;
  } catch (error) {
    console.error(error);
  }
}

async function getFileContent() {
  const filePath = join(import.meta.dirname, 'config', 'information.txt');
  try {
    const content = await readFile(filePath, { encoding: 'utf-8' });
    return `file content: ${content}`;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${filePath}`);
    } else {
      console.error('Failed to read file:', error);
    }
    return null;
  }
}

function getEnvVariable() {
  return `env variable: MESSAGE=${process.env.MESSAGE}`;
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
  const pingPongCounter = await getPingPongCounter();
  const fileContent = await getFileContent();
  const envVariable = getEnvVariable();
  res.send(`${fileContent}\n${envVariable}\n${currentStatus}\nPing / Pongs: ${pingPongCounter}`);
});

while (true) {
  await logRandomString();
  await sleep(5000);
}
