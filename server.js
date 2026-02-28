const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.post('/api/posts/view', (req, res) => {
  const { userId, postId } = req.body;
  // Award coins for viewing
  res.json({ success: true, coinsEarned: 1 });
});

app.post('/api/posts/upload', (req, res) => {
  const { userId, postData } = req.body;
  res.json({ success: true, message: 'Post uploaded' });
});

app.get('/api/user/balance/:userId', (req, res) => {
  res.json({ balance: 0 });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
