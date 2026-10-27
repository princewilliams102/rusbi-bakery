const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const db = new DatabaseSync(':memory:');
db.exec('PRAGMA foreign_keys = ON;');
db.exec(fs.readFileSync(path.join(__dirname, '../database/schema_sqlite.sql'), 'utf8'));
db.exec(fs.readFileSync(path.join(__dirname, '../database/seeds.sql'), 'utf8'));

console.log('Testing Opening Balance Import...');

// Check initial Opening Balance Equity
const equityAccount = db.prepare("SELECT * FROM accounts WHERE code = '3900'").get();
console.log('Equity Account 3900:', equityAccount.name);

// Verify that Party 3 (Alhaji Ishaq) exists in rb_parties
const party3 = db.prepare("SELECT * FROM rb_parties WHERE id = 3").get();
console.log('Party 3:', party3.display_name);

// Check seeds and ensure accounts are active
const activeCount = db.prepare("SELECT COUNT(*) AS c FROM accounts WHERE is_active = 1").get().c;
console.log(`Active accounts count: ${activeCount}`);

if (activeCount < 40) {
  throw new Error(`Expected at least 40 active accounts, found ${activeCount}`);
}

console.log('Opening balance test preconditions verified.');
