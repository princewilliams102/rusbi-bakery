/**
 * Rusbi Bakery OS · Sprint 0 Exit Test Harness (Node.js Runner)
 * Uses native node:sqlite to verify the 9 critical GL and Sub-Ledger invariants.
 */

const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

// 1. Invariant Exceptions
class PostingException extends Error {
  constructor(message) {
    super(message);
    this.name = 'PostingException';
  }
}

// 2. JS PostingService Invariant Implementation
class PostingService {
  constructor(db) {
    this.db = db;
  }

  post(header, lines, idempotencyKey = null, eventLog = null) {
    if (idempotencyKey) {
      const existing = this.db.prepare(
        'SELECT journal_id FROM journal_idempotency WHERE idempotency_key = ?'
      ).get(idempotencyKey);

      if (existing) {
        return {
          status: 'duplicate',
          journal_id: existing.journal_id,
          already_posted: true,
          message: `Posting skipped: idempotency key already processed in journal #${existing.journal_id}`
        };
      }
    }

    if (!lines || lines.length < 2) {
      throw new PostingException(`A valid double-entry journal requires at least 2 lines; got ${lines ? lines.length : 0}.`);
    }

    // Validate and normalize lines
    let totalDebit = 0.0;
    let totalCredit = 0.0;
    const normalizedLines = [];

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const debit = Math.round((Number(line.debit) || 0) * 100) / 100;
      const credit = Math.round((Number(line.credit) || 0) * 100) / 100;

      if (debit < 0 || credit < 0) {
        throw new PostingException(`Line #${idx} cannot have negative amounts.`);
      }
      if (debit > 0 && credit > 0) {
        throw new PostingException(`Line #${idx} cannot have both debit and credit greater than zero.`);
      }
      if (debit === 0 && credit === 0) {
        throw new PostingException(`Line #${idx} must have either debit or credit greater than zero.`);
      }

      const accIdent = line.account_id || line.account_code;
      if (!accIdent) {
        throw new PostingException(`Line #${idx} missing account_id or account_code.`);
      }

      const acc = this.resolveAccount(accIdent);
      if (Number(acc.is_leaf) !== 1) {
        throw new PostingException(`Cannot post to parent account code "${acc.code}". Only leaf accounts accept lines.`);
      }

      totalDebit += debit;
      totalCredit += credit;

      normalizedLines.push({
        account_id: acc.id,
        account_code: acc.code,
        debit,
        credit,
        memo: line.memo || null
      });
    }

    totalDebit = Math.round(totalDebit * 100) / 100;
    totalCredit = Math.round(totalCredit * 100) / 100;

    if (Math.abs(totalDebit - totalCredit) > 0.005) {
      throw new PostingException(`Unbalanced journal: Debits (${totalDebit.toFixed(2)}) != Credits (${totalCredit.toFixed(2)}).`);
    }

    const date = header.date || new Date().toISOString().slice(0, 10);
    const period = header.period || date.slice(0, 7);
    const memo = header.memo || 'Journal Entry';
    const ref = header.ref || null;
    const sourceType = header.source_type || 'manual';
    const sourceId = header.source_id || 0;
    const status = header.status || 'posted';
    const createdBy = header.created_by || 1;

    // Transaction
    this.db.exec('BEGIN TRANSACTION;');
    try {
      const insHeader = this.db.prepare(`
        INSERT INTO journal_entries (
          date, period, memo, ref, source_type, source_id, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insHeader.run(date, period, memo, ref, sourceType, sourceId, status, createdBy);

      const lastIdRow = this.db.prepare('SELECT last_insert_rowid() AS id').get();
      const journalId = lastIdRow.id;

      const insLine = this.db.prepare(`
        INSERT INTO journal_lines (
          journal_id, account_id, account_code_snapshot, debit, credit, memo
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const nl of normalizedLines) {
        insLine.run(journalId, nl.account_id, nl.account_code, nl.debit, nl.credit, nl.memo || memo);
      }

      if (idempotencyKey) {
        this.db.prepare(`
          INSERT INTO journal_idempotency (idempotency_key, journal_id) VALUES (?, ?)
        `).run(idempotencyKey, journalId);
      }

      if (eventLog) {
        this.db.prepare(`
          INSERT INTO rb_event_log (
            event_type, entity_type, entity_id, actor_user_id, device_id, payload_json, gl_journal_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          eventLog.event_type || 'gl_posting',
          eventLog.entity_type || sourceType,
          eventLog.entity_id || sourceId,
          eventLog.actor_user_id || createdBy,
          eventLog.device_id || null,
          JSON.stringify(eventLog.payload || {}),
          journalId
        );
      }

      this.db.exec('COMMIT;');
      return {
        status: 'posted',
        journal_id: journalId,
        period,
        lines_count: normalizedLines.length
      };
    } catch (err) {
      try { this.db.exec('ROLLBACK;'); } catch (_) {}
      throw err;
    }
  }

  reverse(journalId, reason, actorUserId = 1) {
    const orig = this.db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(journalId);
    if (!orig) {
      throw new PostingException(`Journal #${journalId} not found.`);
    }
    if (orig.status !== 'posted') {
      throw new PostingException(`Only posted journals can be reversed. Current status: ${orig.status}`);
    }

    const lines = this.db.prepare('SELECT * FROM journal_lines WHERE journal_id = ?').all(journalId);
    if (!lines || lines.length === 0) {
      throw new PostingException(`Journal #${journalId} has no lines.`);
    }

    this.db.exec('BEGIN TRANSACTION;');
    try {
      const revDate = new Date().toISOString().slice(0, 10);
      const revPeriod = revDate.slice(0, 7);

      this.db.prepare(`
        INSERT INTO journal_entries (
          date, period, memo, ref, source_type, source_id, status, reverses_journal_id, created_by
        ) VALUES (?, ?, ?, ?, 'reversal', ?, 'posted', ?, ?)
      `).run(
        revDate,
        revPeriod,
        `Correction Reversal of #${journalId}: ${reason}`,
        `REV-${journalId}`,
        journalId,
        journalId,
        actorUserId
      );

      const revId = this.db.prepare('SELECT last_insert_rowid() AS id').get().id;

      const insLine = this.db.prepare(`
        INSERT INTO journal_lines (
          journal_id, account_id, account_code_snapshot, debit, credit, memo
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const line of lines) {
        insLine.run(revId, line.account_id, line.account_code_snapshot, line.credit, line.debit, `Reversal of line #${line.id}`);
      }

      this.db.prepare("UPDATE journal_entries SET status = 'reversed' WHERE id = ?").run(journalId);

      this.db.exec('COMMIT;');
      return {
        status: 'reversed',
        original_journal_id: journalId,
        reversal_journal_id: revId,
        period: revPeriod
      };
    } catch (err) {
      try { this.db.exec('ROLLBACK;'); } catch (_) {}
      throw err;
    }
  }

  getAccountBalance(accountIdent, period = null) {
    const acc = this.resolveAccount(accountIdent);
    let sql = `
      SELECT 
        COALESCE(SUM(jl.debit), 0.0) AS total_debit,
        COALESCE(SUM(jl.credit), 0.0) AS total_credit
      FROM journal_lines jl
      JOIN journal_entries je ON jl.journal_id = je.id
      WHERE jl.account_id = ? AND je.status IN ('posted', 'reversed')
    `;
    const params = [acc.id];
    if (period) {
      sql += ' AND je.period <= ?';
      params.push(period);
    }

    const row = this.db.prepare(sql).get(...params);
    const deb = Number(row?.total_debit || 0);
    const cred = Number(row?.total_credit || 0);

    if (acc.normal_balance === 'credit') {
      return Math.round((cred - deb) * 100) / 100;
    }
    return Math.round((deb - cred) * 100) / 100;
  }

  refreshBalanceCache(period = null) {
    const curPeriod = period || new Date().toISOString().slice(0, 7);
    const sql = `
      SELECT 
        jl.account_id,
        a.normal_balance,
        COALESCE(SUM(jl.debit), 0.0) AS sum_debit,
        COALESCE(SUM(jl.credit), 0.0) AS sum_credit
      FROM journal_lines jl
      JOIN journal_entries je ON jl.journal_id = je.id
      JOIN accounts a ON jl.account_id = a.id
      WHERE je.period = ? AND je.status IN ('posted', 'reversed')
      GROUP BY jl.account_id, a.normal_balance
    `;
    const rows = this.db.prepare(sql).all(curPeriod);

    const upsert = this.db.prepare(`
      INSERT INTO account_balances_cache (account_id, period, debit_total, credit_total, balance, refreshed_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(account_id, period) DO UPDATE SET
        debit_total = excluded.debit_total,
        credit_total = excluded.credit_total,
        balance = excluded.balance,
        refreshed_at = CURRENT_TIMESTAMP
    `);

    let count = 0;
    for (const r of rows) {
      const deb = Math.round(Number(r.sum_debit) * 100) / 100;
      const cred = Math.round(Number(r.sum_credit) * 100) / 100;
      const bal = r.normal_balance === 'credit'
        ? Math.round((cred - deb) * 100) / 100
        : Math.round((deb - cred) * 100) / 100;

      upsert.run(r.account_id, curPeriod, deb, cred, bal);
      count++;
    }
    return count;
  }

  resolveAccount(identifier) {
    let row;
    if (typeof identifier === 'number' || /^\d+$/.test(identifier)) {
      row = this.db.prepare('SELECT * FROM accounts WHERE id = ? AND is_active = 1').get(Number(identifier));
      if (!row) {
        row = this.db.prepare('SELECT * FROM accounts WHERE code = ? AND is_active = 1').get(String(identifier));
      }
    } else {
      row = this.db.prepare('SELECT * FROM accounts WHERE code = ? AND is_active = 1').get(String(identifier));
    }

    if (!row) {
      throw new PostingException(`Account not found or inactive: "${identifier}"`);
    }
    return row;
  }
}

// 3. Nightly Integrity Auditor
class NightlyIntegrityCheck {
  constructor(db, postingService) {
    this.db = db;
    this.posting = postingService;
  }

  run(targetPeriod = null) {
    const period = targetPeriod || new Date().toISOString().slice(0, 7);
    const unb = this.db.prepare(`
      SELECT 
        je.id,
        je.memo,
        je.date,
        ROUND(SUM(jl.debit), 2) AS sum_debit,
        ROUND(SUM(jl.credit), 2) AS sum_credit,
        ROUND(ABS(SUM(jl.debit) - SUM(jl.credit)), 2) AS diff
      FROM journal_entries je
      JOIN journal_lines jl ON je.id = jl.journal_id
      WHERE je.status IN ('posted', 'reversed')
      GROUP BY je.id, je.memo, je.date
      HAVING diff > 0.005
    `).all();

    const orph = this.db.prepare(`
      SELECT 
        jl.id AS line_id,
        jl.journal_id,
        jl.account_id,
        jl.account_code_snapshot,
        a.id AS found_account_id,
        a.is_leaf
      FROM journal_lines jl
      LEFT JOIN accounts a ON jl.account_id = a.id
      WHERE a.id IS NULL OR a.is_leaf = 0
    `).all();

    const revMismatch = this.db.prepare(`
      SELECT 
        je.id AS reversal_id,
        je.reverses_journal_id,
        orig.id AS original_id,
        orig.status AS original_status
      FROM journal_entries je
      LEFT JOIN journal_entries orig ON je.reverses_journal_id = orig.id
      WHERE je.reverses_journal_id IS NOT NULL 
        AND (orig.id IS NULL OR orig.status != 'reversed')
    `).all();

    const tbRow = this.db.prepare(`
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
    const inBalance = variance < 0.005;

    const cacheRefreshed = this.posting.refreshBalanceCache(period);

    const isOk = (unb.length === 0 && orph.length === 0 && revMismatch.length === 0 && inBalance);

    return {
      status: isOk ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      target_period: period,
      unbalanced_journals: unb,
      orphaned_lines: orph,
      reversal_mismatches: revMismatch,
      trial_balance: {
        total_debits: totDeb,
        total_credits: totCred,
        variance,
        in_balance: inBalance
      },
      cache_refreshed_count: cacheRefreshed
    };
  }
}

// 4. Test Suite Execution
function runSuite() {
  console.log('================================================================');
  console.log('RUSBI BAKERY OS · SPRINT 0 EXIT TEST HARNESS (Node.js / SQLite)');
  console.log('================================================================\n');

  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');

  const schemaPath = path.join(__dirname, '../database/schema_sqlite.sql');
  const seedsPath = path.join(__dirname, '../database/seeds.sql');

  db.exec(fs.readFileSync(schemaPath, 'utf8'));
  db.exec(fs.readFileSync(seedsPath, 'utf8'));

  // Seed non-leaf test account
  db.prepare(`
    INSERT INTO accounts (code, name, type, normal_balance, is_leaf, is_active)
    VALUES ('1000', 'Current Assets Summary', 'asset', 'debit', 0, 1)
  `).run();

  const posting = new PostingService(db);
  const integrity = new NightlyIntegrityCheck(db, posting);

  const tests = [
    {
      name: 'Test 1: Post cash sale (D 1010 / C 4010) balanced with snapshot',
      fn: () => {
        const res = posting.post(
          { date: '2026-10-27', memo: 'Cash sale 50 loaves', source_type: 'sale', source_id: 101 },
          [
            { account_code: '1010', debit: 50000.00, credit: 0.0 },
            { account_code: '4010', debit: 0.0, credit: 50000.00 }
          ],
          'TEST-CASH-SALE-001'
        );

        if (res.status !== 'posted') throw new Error(`Status ${res.status}`);
        const lines = db.prepare('SELECT * FROM journal_lines WHERE journal_id = ? ORDER BY id ASC').all(res.journal_id);
        if (lines.length !== 2) throw new Error(`Expected 2 lines, got ${lines.length}`);
        if (lines[0].account_code_snapshot !== '1010' || lines[0].debit !== 50000) throw new Error('Line 1 snapshot/debit invalid');
        if (lines[1].account_code_snapshot !== '4010' || lines[1].credit !== 50000) throw new Error('Line 2 snapshot/credit invalid');
      }
    },
    {
      name: 'Test 2: Post Bashi credit sale (D 1200 / C 4010) linked to rb_bashi_ledger',
      fn: () => {
        const res = posting.post(
          { date: '2026-10-27', memo: 'Bashi credit sale to Alhaji Ishaq', source_type: 'bashi_sale', source_id: 3 },
          [
            { account_code: '1200', debit: 120000.00, credit: 0.0 },
            { account_code: '4010', debit: 0.0, credit: 120000.00 }
          ],
          'TEST-BASHI-SALE-002',
          { event_type: 'bashi_sale', entity_type: 'party', entity_id: 3, actor_user_id: 8 }
        );

        db.prepare(`
          INSERT INTO rb_bashi_ledger (
            party_id, entry_date, event_type, amount, direction, running_balance, ref, gl_journal_id, actor_user_id
          ) VALUES (
            3, '2026-10-27', 'sale', 120000.00, 'debit', 120000.00, 'INV-BASHI-002', ?, 8
          )
        `).run(res.journal_id);

        const check = db.prepare('SELECT gl_journal_id FROM rb_bashi_ledger WHERE gl_journal_id = ?').get(res.journal_id);
        if (!check) throw new Error('Bashi ledger not linked to GL journal');
      }
    },
    {
      name: 'Test 3: Replay idempotency key returns duplicate status without duplicate journal',
      fn: () => {
        const res1 = posting.post(
          { date: '2026-10-27', memo: 'First attempt', source_type: 'sale', source_id: 102 },
          [
            { account_code: '1010', debit: 10000.00, credit: 0.0 },
            { account_code: '4010', debit: 0.0, credit: 10000.00 }
          ],
          'IDEM-UNIQUE-KEY-001'
        );

        const res2 = posting.post(
          { date: '2026-10-27', memo: 'Replay attempt', source_type: 'sale', source_id: 102 },
          [
            { account_code: '1010', debit: 10000.00, credit: 0.0 },
            { account_code: '4010', debit: 0.0, credit: 10000.00 }
          ],
          'IDEM-UNIQUE-KEY-001'
        );

        if (res2.status !== 'duplicate' || res2.journal_id !== res1.journal_id) {
          throw new Error('Idempotency duplicate detection failed');
        }

        const count = db.prepare("SELECT COUNT(*) AS c FROM journal_idempotency WHERE idempotency_key = 'IDEM-UNIQUE-KEY-001'").get().c;
        if (count !== 1) throw new Error('Duplicate idempotency rows found');
      }
    },
    {
      name: 'Test 4: Post unbalanced journal throws exception and rolls back',
      fn: () => {
        let threw = false;
        const countBefore = db.prepare('SELECT COUNT(*) AS c FROM journal_entries').get().c;
        try {
          posting.post(
            { memo: 'Unbalanced', source_type: 'test', source_id: 1 },
            [
              { account_code: '1010', debit: 50000.00, credit: 0.0 },
              { account_code: '4010', debit: 0.0, credit: 45000.00 }
            ]
          );
        } catch (e) {
          threw = true;
        }
        if (!threw) throw new Error('Did not throw on unbalanced journal');
        const countAfter = db.prepare('SELECT COUNT(*) AS c FROM journal_entries').get().c;
        if (countBefore !== countAfter) throw new Error('Rollback failed; entry persisted');
      }
    },
    {
      name: 'Test 5: Post invalid line with debit & credit > 0 throws exception',
      fn: () => {
        let threw = false;
        try {
          posting.post(
            { memo: 'Invalid line', source_type: 'test', source_id: 2 },
            [
              { account_code: '1010', debit: 1000.00, credit: 500.00 },
              { account_code: '4010', debit: 0.0, credit: 500.00 }
            ]
          );
        } catch (e) {
          threw = true;
        }
        if (!threw) throw new Error('Did not throw on line with both debit & credit');
      }
    },
    {
      name: 'Test 6: Post to parent account (is_leaf=0) throws exception',
      fn: () => {
        let threw = false;
        try {
          posting.post(
            { memo: 'Parent account', source_type: 'test', source_id: 3 },
            [
              { account_code: '1000', debit: 5000.00, credit: 0.0 },
              { account_code: '4010', debit: 0.0, credit: 5000.00 }
            ]
          );
        } catch (e) {
          threw = true;
        }
        if (!threw) throw new Error('Did not throw on posting to parent account');
      }
    },
    {
      name: 'Test 7: Post journal and reverse immutably with net zero balance',
      fn: () => {
        const orig = posting.post(
          { date: '2026-10-27', memo: 'Entry to reverse', source_type: 'sale', source_id: 999 },
          [
            { account_code: '1010', debit: 75000.00, credit: 0.0 },
            { account_code: '4010', debit: 0.0, credit: 75000.00 }
          ]
        );

        const rev = posting.reverse(orig.journal_id, 'Reversal test', 1);

        const origRow = db.prepare('SELECT status FROM journal_entries WHERE id = ?').get(orig.journal_id);
        if (origRow.status !== 'reversed') throw new Error('Original status not reversed');

        const revRow = db.prepare('SELECT reverses_journal_id, status FROM journal_entries WHERE id = ?').get(rev.reversal_journal_id);
        if (revRow.reverses_journal_id !== orig.journal_id || revRow.status !== 'posted') {
          throw new Error('Reversal row invalid');
        }

        const bal1010 = posting.getAccountBalance('1010');
        // Test 1 (50000) + Test 3 (10000) = 60000. The 75000 was reversed, net 0.
        if (bal1010 !== 60000) {
          throw new Error(`Expected balance 60000 on 1010, got ${bal1010}`);
        }
      }
    },
    {
      name: 'Test 8: Nightly integrity audit returns OK with balanced GL',
      fn: () => {
        const rep = integrity.run();
        if (rep.status !== 'OK') throw new Error(`Integrity check status: ${rep.status}`);
        if (!rep.trial_balance.in_balance) throw new Error('Trial balance out of balance');
      }
    },
    {
      name: 'Test 9: Full day multi-tender sales and safe drops tie out to trial balance',
      fn: () => {
        // POS Sale
        posting.post(
          { memo: 'Moniepoint POS batch', source_type: 'sale', source_id: 201 },
          [
            { account_code: '1050', debit: 150000.00, credit: 0.0 },
            { account_code: '4010', debit: 0.0, credit: 150000.00 }
          ]
        );

        // Vault Safe Drop
        posting.post(
          { memo: 'Vault safe drop till #1', source_type: 'cash_drop', source_id: 1 },
          [
            { account_code: '1020', debit: 40000.00, credit: 0.0 },
            { account_code: '1010', debit: 0.0, credit: 40000.00 }
          ]
        );

        // Generator fuel expense
        posting.post(
          { memo: 'Diesel 20L', source_type: 'expense', source_id: 1 },
          [
            { account_code: '5200', debit: 25000.00, credit: 0.0 },
            { account_code: '1010', debit: 0.0, credit: 25000.00 }
          ]
        );

        const rep = integrity.run();
        if (rep.status !== 'OK') throw new Error(`Integrity check failed: ${JSON.stringify(rep)}`);
        if (rep.trial_balance.variance > 0.005) {
          throw new Error(`Trial balance variance: ${rep.trial_balance.variance}`);
        }
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      t.fn();
      console.log(` [PASS] ${t.name}`);
      passed++;
    } catch (err) {
      console.error(` [FAIL] ${t.name}`);
      console.error(`        Error: ${err.message}`);
      failed++;
    }
  }

  console.log('\n----------------------------------------------------------------');
  console.log(`Summary: ${passed} passed, ${failed} failed out of ${tests.length} tests.`);
  console.log('----------------------------------------------------------------\n');

  if (failed > 0) process.exit(1);
}

runSuite();
