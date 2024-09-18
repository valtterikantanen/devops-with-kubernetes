import { writeFile } from 'fs/promises';
import { join } from 'path';

const filePath = join(import.meta.dirname, 'files', 'timestamp.txt');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveTimestamp() {
  try {
    await writeFile(filePath, `${new Date().toISOString()}`);
  } catch (error) {
    console.error('Failed to save timestamp:', error);
  }
}

while (true) {
  await saveTimestamp();
  await sleep(5000);
}
