const express = require('express');
const db = require('../db');

const router = express.Router();

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
  if (!url) return res.status(400).json({ error: 'url is required' });

  const shortCode = Math.random().toString(36).substring(2, 8);
  db.run('INSERT INTO urls (short_code, url, visits) VALUES (?, ?, 0)', [shortCode, url], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to create short url' });
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    res.json({ shortCode, shortUrl });
  });
});

module.exports = router;
