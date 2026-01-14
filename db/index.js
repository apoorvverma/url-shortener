const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database and export a singleton connection
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

module.exports = db;
