const express = require('express');
const db = require('../db');
const crypto = require('crypto');

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

router.get('/urls/visits', (req, res) => {
  db.all('SELECT * FROM urls_visits', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch url visits' });
    res.json(rows);
  });
});

// Create short URL
router.post('/shorten', (req, res) => {
  const { url } = req.body;

  if (!isValidHttpUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL. Only http(s) URLs are allowed.' });
  }

  const createdAt = new Date().toISOString();
  const maxAttempts = 3;

  function tryInsert(attempt = 1) {
    const shortCode = crypto.randomBytes(5).toString('base64url').slice(0, 7);
    
    db.run(
      'INSERT INTO urls (short_code, url, visits, created_at, updated_at) VALUES (?, ?, 0, ?, ?)',
      [shortCode, url, createdAt, createdAt],
      (err) => {
        if (err) {

          if (attempt < maxAttempts) {
            return tryInsert(attempt + 1);
          }
          return res.status(500).json({ error: 'Failed to create short url' });
        }
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        res.json({ shortCode, shortUrl });
      }
    );
  }

  tryInsert();
});

module.exports = router;
