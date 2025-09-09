const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data
let comments = [];
let parts = [];
let nextId = 1;

// Simulated logged-in user
const users = [{ id: 1, name: "Alice" }];
app.use((req, res, next) => {
  req.user = users[0];
  next();
});

// --- Comments ---
app.get('/comments', (req, res) => res.json(comments));

app.post('/comments', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const comment = { id: nextId++, text, userId: req.user.id };
  comments.push(comment);
  res.json(comment);
});

app.delete('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comment = comments.find(c => c.id === id);
  if (!comment) return res.status(404).json({ error: 'Not found' });
  if (comment.userId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  comments = comments.filter(c => c.id !== id);
  res.json({ success: true });
});

// --- Parts ---
app.get('/parts', (req, res) => res.json(parts));

app.post('/parts', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const part = { id: nextId++, name, userId: req.user.id };
  parts.push(part);
  res.json(part);
});

app.delete('/parts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const part = parts.find(p => p.id === id);
  if (!part) return res.status(404).json({ error: 'Not found' });
  if (part.userId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  parts = parts.filter(p => p.id !== id);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
