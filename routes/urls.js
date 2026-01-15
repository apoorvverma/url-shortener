const express = require('express');
const db = require('../db');

const router = express.Router();

function isValidHttpUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}


// Get all URLs
router.get('/urls', (req, res) => {
  db.all('SELECT * FROM urls', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch urls' });
    res.json(rows);
  });
});

// Create short URL
router.post('/shorten', (req, res) => {
  const { url } = req.body;

  if (!isValidHttpUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL. Only http(s) URLs are allowed.' });
  }

  const shortCode = Math.random().toString(36).substring(2, 8);

  db.run('INSERT INTO urls (short_code, url, visits) VALUES (?, ?, 0)', [shortCode, url], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to create short url' });
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    res.json({ shortCode, shortUrl });
  });
});

module.exports = router;
