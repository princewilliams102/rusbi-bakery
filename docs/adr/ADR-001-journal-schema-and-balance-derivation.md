# ADR-001: Hardened GL Journal Schema and Dynamic Balance Derivation

## Status
Accepted

## Context
In financial accounting software, allowing direct in-line mutations of account balances (e.g. `UPDATE accounts SET balance = balance + 500`) invariably produces state drift, reconciliation failures, and inability to produce an audit trail. Additionally, historical reorganizations of account codes can retroactively obscure what an account represented at the time a transaction occurred.

## Decision
1. **Immutable Journal Schema**:
   `journal_entries` records contain `date`, `period` (`CHAR(7)`, e.g. `'2026-10'`), `status` (`'draft'`, `'posted'`, `'reversed'`), `source_type`, `source_id`, and `reverses_journal_id`.
2. **Snapshot Account Codes**:
   `journal_lines` enforces a Foreign Key referencing `accounts(id)`, but also stores `account_code_snapshot VARCHAR(16) NOT NULL` so historical reporting remains exact even if account hierarchies change.
3. **Single Source of Truth**:
   The authoritative balance of any account is strictly $\sum \text{Debit} - \sum \text{Credit}$ from `journal_lines`.
4. **Materialized Cache**:
   A dedicated `account_balances_cache` table is refreshed every 5 minutes by cron or on-demand, providing fast read performance for P&L and Balance Sheet reports without compromising the authoritative ledger.

## Consequences
- Historical transactions can never be silently edited or deleted.
- Adjustments and corrections require an explicit reversing entry.
- Direct balance updates are banned at the database and application levels.
