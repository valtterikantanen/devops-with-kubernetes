import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 3000;
await fs.mkdir(path.join(import.meta.dirname, 'static', 'assets', 'images'), { recursive: true });
const imagePath = path.join(import.meta.dirname, 'static', 'assets', 'images', 'image.jpg');

async function fetchAndSaveImage() {
  try {
    const imageUrl = 'https://picsum.photos/1200';
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
    });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }
    await fs.writeFile(imagePath, response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}

async function shouldFetchImage() {
  try {
    const stats = await fs.stat(imagePath);
    const lastModified = stats.mtimeMs;
    return Date.now() - lastModified > 60 * 60 * 1000;
  } catch (error) {
    return true;
  }
}

app.get('/', async (req, res) => {
  const shouldFetch = await shouldFetchImage();
  if (shouldFetch) {
    await fetchAndSaveImage();
  }
  res.sendFile(path.resolve(import.meta.dirname, 'static', 'index.html'));
});

app.use(express.static('static'));

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
