import express from 'express';
const app = express();

app.use(express.static('.'));

app.listen(7000, () => {
  console.log('Server running on http://localhost:7000');
});
