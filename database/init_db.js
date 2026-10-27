/**
 * Rusbi Bakery Database Initializer
 * Creates and seeds data/books.sqlite
 */
const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlitePath = path.join(dbDir, 'books.sqlite');
console.log(`Initializing SQLite database at: ${sqlitePath}`);

const db = new DatabaseSync(sqlitePath);
db.exec('PRAGMA foreign_keys = ON;');

const schema = fs.readFileSync(path.join(__dirname, 'schema_sqlite.sql'), 'utf8');
db.exec(schema);

// Also create kv_store for Apex Books frontend state compatibility
db.exec(`
  CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
  );
`);

// Check if accounts already seeded
const accCount = db.prepare('SELECT COUNT(*) AS c FROM accounts').get().c;
if (accCount === 0) {
  const seeds = fs.readFileSync(path.join(__dirname, 'seeds.sql'), 'utf8');
  db.exec(seeds);
  console.log('Seeds executed successfully.');
} else {
  console.log(`Accounts already present (${accCount} records).`);
}

const finalCount = db.prepare('SELECT COUNT(*) AS c FROM accounts').get().c;
console.log(`Database initialized successfully. Total GL accounts: ${finalCount}`);
