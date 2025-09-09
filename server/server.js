const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// JSON file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data (will be loaded from JSON)
let comments = [];
let parts = [];
let nextId = 1;

// Load data from JSON file if it exists
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    comments = data.comments || [];
    parts = data.parts || [];
    nextId = data.nextId || 1;
  }
}

// Save data to JSON file
function saveData() {
  const data = { comments, parts, nextId };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Load existing data at server start
loadData();

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
  saveData();
  res.json(comment);
});

app.delete('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comment = comments.find(c => c.id === id);
  if (!comment) return res.status(404).json({ error: 'Not found' });
  if (comment.userId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  comments = comments.filter(c => c.id !== id);
  saveData();
  res.json({ success: true });
});

// --- Parts ---
app.get('/parts', (req, res) => res.json(parts));

app.post('/parts', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const part = { id: nextId++, name, userId: req.user.id };
  parts.push(part);
  saveData();
  res.json(part);
});

app.delete('/parts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const part = parts.find(p => p.id === id);
  if (!part) return res.status(404).json({ error: 'Not found' });
  if (part.userId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  parts = parts.filter(p => p.id !== id);
  saveData();
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
