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

function normalizeUrlMinimal(input) {
  const u = new URL(input);
  // lowercase; drop fragment; keeping query
  u.protocol = u.protocol.toLowerCase();
  u.hostname = u.hostname.toLowerCase();
  u.hash = '';
  return u.toString();
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
  const normalized = normalizeUrlMinimal(url);

  function tryInsert(attempt = 1) {
    const shortCode = crypto.randomBytes(5).toString('base64url').slice(0, 7);

    db.run(
      'INSERT INTO urls (short_code, url, normalized_url, visits, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)',
      [shortCode, url, normalized, createdAt, createdAt],
      (err) => {
        if (err) {
          const msg = String((err && err.message) || '');
          const isConstraint = /SQLITE_CONSTRAINT/.test(msg);
          const normalizedConflict = isConstraint && /normalized_url/i.test(msg);
          const shortCodeConflict = isConstraint && /short_code/i.test(msg);

          if (normalizedConflict) {
            return db.get(
              'SELECT short_code FROM urls WHERE normalized_url = ?',
              [normalized],
              (selErr, row) => {
                if (selErr || !row) {
                  return res.status(500).json({ error: 'Failed to fetch existing short url' });
                }
                const existingShort = row.short_code;
                const shortUrl = `${req.protocol}://${req.get('host')}/${existingShort}`;
                return res.json({ shortCode: existingShort, shortUrl });
              },
            );
          }

          if (shortCodeConflict && attempt < maxAttempts) {
            return tryInsert(attempt + 1);
          }

          if (isConstraint && attempt < maxAttempts) {
            return tryInsert(attempt + 1);
          }
          return res.status(500).json({ error: 'Failed to create short url' });
        }
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        res.json({ shortCode, shortUrl });
      },
    );
  }

  tryInsert();
});

module.exports = router;
