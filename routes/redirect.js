const express = require('express');
const db = require('../db');

const router = express.Router();

// Redirect to original URL and record visit
router.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const { deviceId } = req.query;

  db.get('SELECT * FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    db.run('UPDATE urls SET visits = ? WHERE short_code = ?', [Number(row.visits || 0) + 1, shortCode]);
    db.run('INSERT INTO urls_visits (device_id, short_code, created_at) VALUES (?,?,?)', [deviceId || null, shortCode, Date.now()]);

    res.redirect(row.url);
  });
});

module.exports = router;
