const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database and export a singleton connection
const dbPath = process.env.DB_PATH || 'urls.db';
const db = new sqlite3.Database(dbPath);

// On startup, create the tables needed if they don't exist.
db.serialize(() => {
  // Table for the short URLs
  db.run(`CREATE TABLE IF NOT EXISTS urls (
    short_code TEXT PRIMARY KEY,
    url TEXT,
    normalized_url TEXT,
    visits INTEGER,
    created_at TEXT,
    updated_at TEXT
  )`);

  // Table for all unique device visits to the short URLs
  db.run(`CREATE TABLE IF NOT EXISTS urls_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    short_code TEXT,
    visit_count INTEGER,
    created_at TEXT,
    updated_at TEXT
  )`);
});

// for existing dbs
db.run('ALTER TABLE urls ADD COLUMN normalized_url TEXT', (_err) => {
  // console.info("normalized_url column already exists");
});

// unique index on normalized_url exists
db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_urls_normalized_url ON urls(normalized_url)');

// for existing dbs
db.run('ALTER TABLE urls_visits ADD COLUMN visit_count INTEGER', (_err) => {
  // console.info("visit_count column already exists");
});
db.run('ALTER TABLE urls_visits ADD COLUMN updated_at TEXT', (_err) => {
  // console.info("updated_at column already exists");
});

// unique index on (device_id, short_code) to support upsert per device
db.run(
  'CREATE UNIQUE INDEX IF NOT EXISTS idx_urls_visits_device_short ON urls_visits(device_id, short_code)',
);

module.exports = db;
