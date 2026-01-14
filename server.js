const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new sqlite3.Database('urls.db');

// On startup, create the tables needed if they don't exist.
db.serialize(() => {
  // Table for the short URLs
  db.run(`CREATE TABLE IF NOT EXISTS urls (
    short_code TEXT PRIMARY KEY,
    url TEXT,
    visits INTEGER,
    created_at TEXT,
    updated_at TEXT
  )`);

  // Table for all unique device visits to the short URLs
  db.run(`CREATE TABLE IF NOT EXISTS urls_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    short_code TEXT,
    created_at TEXT
  )`);
});

// Middleware
app.use(express.json());

// Home page
app.get("/", (req, res) => { res.sendFile("index.html", { root: "." }) });

// Get all URLs
app.get('/urls', (req, res) => {
  db.all('SELECT * FROM urls', (err, rows) => {
    res.json(rows);
  });
});

// Create short URL
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  
  const shortCode = Math.random().toString(36).substring(2, 8);
  db.run('INSERT INTO urls (short_code, url, visits) VALUES (?, ?, 0)', [shortCode, url], () => {
    res.json({ shortCode, shortUrl: `http://localhost:${PORT}/${shortCode}` });
  });
});

// Redirect to original URL
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const { deviceId } = req.query;
  
  db.get('SELECT * FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    db.run(`UPDATE urls SET visits = ? WHERE short_code = ?`, [row.visits + 1, shortCode]);
    db.run(`INSERT INTO urls_visits (device_id, short_code, created_at) VALUES (?,?,?)`, [deviceId, shortCode, Date.now()])
    res.redirect(row.url);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
