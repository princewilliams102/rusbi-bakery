/**
 * Rusbi Bakery OS · Local Development & Live API Server
 * Built with native Node.js (http + node:sqlite)
 * Serves static assets & provides full double-entry GL endpoints locally.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_PATH = path.join(ROOT_DIR, 'data', 'books.sqlite');

// Initialize / connect SQLite DB
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');

// Ensure kv_store & credentials tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
  );
  CREATE TABLE IF NOT EXISTS user_credentials (
    user_id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    updated_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
  );
  CREATE TABLE IF NOT EXISTS password_resets (
    email TEXT PRIMARY KEY,
    otp_hash TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
  );
`);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js':   'application/javascript; charset=UTF-8',
  '.mjs':  'application/javascript; charset=UTF-8',
  '.css':  'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.csv':  'text/csv; charset=UTF-8',
  '.txt':  'text/plain; charset=UTF-8',
  '.pdf':  'application/pdf'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key, X-Idempotency-Key'
  });
  res.end(JSON.stringify(data));
}

function handleApiRequest(req, res, parsedUrl) {
  const action = parsedUrl.query.action || 'status';

  // Read body helper
  const readBody = (callback) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        callback(null, json, body);
      } catch (err) {
        callback(err, null, body);
      }
    });
  };

  // 1. Apex Books KV State sync
  if (action === 'get_state') {
    const row = db.prepare("SELECT value FROM kv_store WHERE key = 'app_state'").get();
    if (row && row.value) {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(row.value);
    }
    return sendJson(res, 200, { empty: true });
  }

  if (action === 'save_state' && req.method === 'POST') {
    return readBody((err, json, raw) => {
      if (err) return sendJson(res, 400, { error: 'Invalid JSON' });
      db.prepare(`
        INSERT INTO kv_store (key, value, updated_at)
        VALUES ('app_state', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).run(raw);
      return sendJson(res, 200, { success: true, saved_at: new Date().toISOString() });
    });
  }

  if (action === 'reset_demo' && req.method === 'POST') {
    db.prepare("DELETE FROM kv_store WHERE key = 'app_state'").run();
    return sendJson(res, 200, { success: true, message: 'Demo state reset' });
  }

  // 2. Health & Status Check
  if (action === 'status') {
    const accCount = db.prepare("SELECT COUNT(*) AS c FROM accounts WHERE is_active = 1").get().c;
    const jeCount = db.prepare("SELECT COUNT(*) AS c FROM journal_entries").get().c;
    const partyCount = db.prepare("SELECT COUNT(*) AS c FROM rb_parties").get().c;
    return sendJson(res, 200, {
      status: 'online',
      product: 'Rusbi Bakery OS',
      version: '1.0.0',
      database: 'SQLite 3 (data/books.sqlite)',
      active_gl_accounts: accCount,
      journal_entries_count: jeCount,
      registered_parties: partyCount,
      server_time: new Date().toISOString()
    });
  }

  // 3. User Credentials Vault
  if (action === 'get_user_credentials') {
    try {
      const creds = db.prepare("SELECT user_id, email, password FROM user_credentials").all();
      return sendJson(res, 200, { success: true, credentials: creds });
    } catch (e) {
      return sendJson(res, 200, { success: true, credentials: [] });
    }
  }

  if (action === 'update_user_credentials' && req.method === 'POST') {
    return readBody((err, payload) => {
      if (err || !payload || !payload.userId) {
        return sendJson(res, 400, { error: 'Invalid user payload' });
      }
      try {
        db.prepare(`
          INSERT INTO user_credentials (user_id, email, password, updated_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id) DO UPDATE SET password = excluded.password, email = excluded.email, updated_at = CURRENT_TIMESTAMP
        `).run(payload.userId, payload.email || '', payload.password || '');
        return sendJson(res, 200, { success: true, updated_user: payload.userId });
      } catch (dbErr) {
        return sendJson(res, 500, { error: dbErr.message });
      }
    });
  }

  // 4. SMTP & Password Reset (Mocked gracefully for local dev)
  if (action === 'test_smtp' && req.method === 'POST') {
    return sendJson(res, 200, {
      success: true,
      method: 'Local Dev SMTP Mock (Simulated)',
      message: 'SMTP configuration verified successfully for Rusbi Bakery OS.'
    });
  }

  if (action === 'send_credentials_email' && req.method === 'POST') {
    return readBody((err, payload) => {
      const to = payload?.to || 'staff';
      return sendJson(res, 200, {
        success: true,
        method: 'Local Dev Gateway (Simulated)',
        to: to,
        message: `Credentials dispatched to ${to}`
      });
    });
  }

  if (action === 'send_invoice_email' && req.method === 'POST') {
    return readBody((err, payload) => {
      const to = payload?.to || 'customer';
      return sendJson(res, 200, {
        success: true,
        to: to,
        message: `Invoice dispatched to ${to}`
      });
    });
  }

  if (action === 'request_password_reset' && req.method === 'POST') {
    return sendJson(res, 200, {
      success: true,
      message: 'A 6-digit verification code has been dispatched. (In local dev, enter 123456 to reset)'
    });
  }

  if (action === 'verify_and_reset_password' && req.method === 'POST') {
    return readBody((err, payload) => {
      return sendJson(res, 200, {
        success: true,
        message: 'Password reset confirmed and updated. You can now sign in.'
      });
    });
  }

  // 5. GL Account Balances
  if (action === 'get_balances') {
    const accounts = db.prepare(`
      SELECT id, code, name, type, normal_balance 
      FROM accounts 
      WHERE is_leaf = 1 AND is_active = 1 
      ORDER BY code ASC
    `).all();

    let totalDebits = 0;
    let totalCredits = 0;

    const list = accounts.map(a => {
      const sumRow = db.prepare(`
        SELECT 
          COALESCE(SUM(jl.debit), 0.0) AS total_debit,
          COALESCE(SUM(jl.credit), 0.0) AS total_credit
        FROM journal_lines jl
        JOIN journal_entries je ON jl.journal_id = je.id
        WHERE jl.account_id = ? AND je.status IN ('posted', 'reversed')
      `).get(a.id);

      const d = Number(sumRow?.total_debit || 0);
      const c = Number(sumRow?.total_credit || 0);
      const bal = a.normal_balance === 'credit'
        ? Math.round((c - d) * 100) / 100
        : Math.round((d - c) * 100) / 100;

      if (a.normal_balance === 'debit') {
        totalDebits += Math.max(0, bal);
      } else {
        totalCredits += Math.max(0, bal);
      }

      return {
        id: a.id,
        code: a.code,
        name: a.name,
        type: a.type,
        normal_balance: a.normal_balance,
        balance: bal
      };
    });

    return sendJson(res, 200, {
      accounts: list,
      summary: {
        total_debits: Math.round(totalDebits * 100) / 100,
        total_credits: Math.round(totalCredits * 100) / 100,
        in_balance: Math.abs(totalDebits - totalCredits) < 0.005
      }
    });
  }

  // 6. Nightly Integrity Cron
  if (action === 'cron_integrity') {
    const unb = db.prepare(`
      SELECT 
        je.id, je.memo, je.date,
        ROUND(SUM(jl.debit), 2) AS sum_debit,
        ROUND(SUM(jl.credit), 2) AS sum_credit,
        ROUND(ABS(SUM(jl.debit) - SUM(jl.credit)), 2) AS diff
      FROM journal_entries je
      JOIN journal_lines jl ON je.id = jl.journal_id
      WHERE je.status IN ('posted', 'reversed')
      GROUP BY je.id, je.memo, je.date
      HAVING diff > 0.005
    `).all();

    const tbRow = db.prepare(`
      SELECT 
        ROUND(COALESCE(SUM(jl.debit), 0.0), 2) AS total_debit,
        ROUND(COALESCE(SUM(jl.credit), 0.0), 2) AS total_credit
      FROM journal_lines jl
      JOIN journal_entries je ON jl.journal_id = je.id
      WHERE je.status IN ('posted', 'reversed')
    `).get();

    const totDeb = Number(tbRow?.total_debit || 0);
    const totCred = Number(tbRow?.total_credit || 0);
    const variance = Math.round(Math.abs(totDeb - totCred) * 100) / 100;

    return sendJson(res, 200, {
      status: (unb.length === 0 && variance < 0.005) ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      unbalanced_journals: unb,
      trial_balance: {
        total_debits: totDeb,
        total_credits: totCred,
        variance,
        in_balance: variance < 0.005
      }
    });
  }

  // 7. Run Exit Tests Endpoint
  if (action === 'run_tests') {
    try {
      const { execSync } = require('node:child_process');
      const output = execSync('node tests/exit_harness.js', { cwd: ROOT_DIR, encoding: 'utf8' });
      return sendJson(res, 200, {
        status: 'success',
        all_passed: true,
        output
      });
    } catch (testErr) {
      return sendJson(res, 500, {
        status: 'failure',
        all_passed: false,
        error: testErr.stdout || testErr.message
      });
    }
  }

  // Fallback for unknown action
  return sendJson(res, 404, { error: `Unknown action: ${action}` });
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key, X-Idempotency-Key'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API router
  if (pathname === '/api.php' || pathname.startsWith('/api/')) {
    return handleApiRequest(req, res, parsedUrl);
  }

  // Serve root index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Normalize path & prevent directory traversal
  const safePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end(`404 Not Found: ${pathname}`);
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`RUSBI BAKERY OS · LOCAL DEVELOPMENT SERVER RUNNING`);
  console.log(`======================================================`);
  console.log(`URL:      http://localhost:${PORT}`);
  console.log(`API:      http://localhost:${PORT}/api.php?action=status`);
  console.log(`Tests:    http://localhost:${PORT}/api.php?action=run_tests`);
  console.log(`Balances: http://localhost:${PORT}/api.php?action=get_balances`);
  console.log(`Database: ${DB_PATH}`);
  console.log(`Root:     ${ROOT_DIR}`);
  console.log(`======================================================\n`);
});
