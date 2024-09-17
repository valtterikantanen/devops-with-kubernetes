import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('<h1>Hello from Kubernetes!</h1>');
});
