import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 3000;

let counter = 0;

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

app.get('/pingpong', (req, res) => {
  res.send(`pong ${counter++}`);
});
