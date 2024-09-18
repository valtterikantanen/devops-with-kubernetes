import express from 'express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const app = express();

const PORT = process.env.PORT ?? 3000;

const filePath = join(import.meta.dirname, 'files', 'pingpong.txt');

let counter = 0;

await writeFile(filePath, `${counter}`);

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

app.get('/pingpong', async (req, res) => {
  res.send(`pong ${counter++}`);
  await writeFile(filePath, `${counter}`);
});
