require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getDB } = require('./db');

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB on startup
getDB().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Database connection failed', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
