import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 3000;
await fs.mkdir(path.join(import.meta.dirname, 'static'), { recursive: true });
const imagePath = path.join(import.meta.dirname, 'static', 'image.jpg');

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

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

app.use(express.static('static'));

app.get('/', async (req, res) => {
  const shouldFetch = await shouldFetchImage();
  if (shouldFetch) {
    await fetchAndSaveImage();
  }
  res.send(`
    <html>
      <body>
        <img src="image.jpg" width="400" height="400" />
        <form>
          <input type="text" maxlength="140" />
          <button type="submit">Create Todo</button>
        </form>
        <ul>
          <li>Todo 1</li>
          <li>Todo 2</li>
        </ul>
      </body>
    </html>
  `);
});
