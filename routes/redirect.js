const express = require('express');
const db = require('../db');
const crypto = require('crypto');

const router = express.Router();

/**
 * Redirect to the original URL and record a visit.
 * - Uses a cookie-based anonymous `visitor_id` to track per-device metrics.
 * - Increments total visits on the URL and upserts a per-device visit count.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
router.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  // get or set visitor_id cookie
  let deviceId = req.cookies && req.cookies.visitor_id;
  if (!deviceId) {
    deviceId = crypto.randomBytes(5).toString('base64url');

    res.cookie('visitor_id', deviceId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
  }

  db.get('SELECT * FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    db.run('UPDATE urls SET visits = visits + 1, updated_at = ? WHERE short_code = ?', [
      new Date().toISOString(),
      shortCode,
    ]);

    // Upsert per-device visits
    const nowIso = new Date().toISOString();
    db.run(
      `INSERT INTO urls_visits (device_id, short_code, visit_count, created_at, updated_at)
       VALUES (?,?,?,?,?)
       ON CONFLICT(device_id, short_code)
       DO UPDATE SET visit_count = visit_count + 1, updated_at = excluded.updated_at`,
      [deviceId, shortCode, 1, nowIso, nowIso],
    );

    res.redirect(row.url);
  });
});

module.exports = router;
