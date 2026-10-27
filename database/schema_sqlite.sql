-- ==============================================================================
-- RUSBI BAKERY OPERATING SYSTEM · SPRINT 0 SCHEMA DDL (SQLite 3 compatible)
-- Hardened General Ledger, Audit Event Bus, Unified Parties & Operational Controls
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- 1. General Ledger Accounts Master
CREATE TABLE IF NOT EXISTS accounts (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  code                  TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  type                  TEXT NOT NULL CHECK(type IN ('asset','liability','equity','revenue','expense')),
  normal_balance        TEXT NOT NULL CHECK(normal_balance IN ('debit','credit')),
  is_leaf               INTEGER NOT NULL DEFAULT 1,
  parent_id             INTEGER NULL,
  is_active             INTEGER NOT NULL DEFAULT 1,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (parent_id) REFERENCES accounts(id)
);

-- 2. Immutable General Ledger Journal Entries (Header)
CREATE TABLE IF NOT EXISTS journal_entries (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  date                  TEXT NOT NULL,
  period                TEXT NOT NULL,
  memo                  TEXT NOT NULL,
  ref                   TEXT NULL,
  source_type           TEXT NOT NULL,
  source_id             INTEGER NOT NULL,
  status                TEXT NOT NULL DEFAULT 'posted' CHECK(status IN ('draft','posted','reversed')),
  reverses_journal_id   INTEGER NULL,
  created_by            INTEGER NOT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (reverses_journal_id) REFERENCES journal_entries(id)
);

CREATE INDEX IF NOT EXISTS idx_je_period_status ON journal_entries(period, status);
CREATE INDEX IF NOT EXISTS idx_je_source ON journal_entries(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_je_date ON journal_entries(date);

-- 3. Journal Lines (Details)
CREATE TABLE IF NOT EXISTS journal_lines (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  journal_id            INTEGER NOT NULL,
  account_id            INTEGER NOT NULL,
  account_code_snapshot TEXT NOT NULL,
  debit                 NUMERIC NOT NULL DEFAULT 0.00,
  credit                NUMERIC NOT NULL DEFAULT 0.00,
  memo                  TEXT NULL,
  FOREIGN KEY (journal_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE INDEX IF NOT EXISTS idx_jl_journal ON journal_lines(journal_id);
CREATE INDEX IF NOT EXISTS idx_jl_account ON journal_lines(account_id);

-- 4. Idempotency Registry for General Ledger Postings
CREATE TABLE IF NOT EXISTS journal_idempotency (
  idempotency_key       TEXT PRIMARY KEY,
  journal_id            INTEGER NOT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (journal_id) REFERENCES journal_entries(id) ON DELETE CASCADE
);

-- 5. Materialized Account Balance Cache
CREATE TABLE IF NOT EXISTS account_balances_cache (
  account_id            INTEGER NOT NULL,
  period                TEXT NOT NULL,
  debit_total           NUMERIC NOT NULL DEFAULT 0.00,
  credit_total          NUMERIC NOT NULL DEFAULT 0.00,
  balance               NUMERIC NOT NULL DEFAULT 0.00,
  refreshed_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  PRIMARY KEY (account_id, period),
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- 6. Unified Parties Mapping Layer
CREATE TABLE IF NOT EXISTS rb_parties (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  kind                  TEXT NOT NULL CHECK(kind IN ('customer','vendor','staff','guarantor','agent')),
  ref_table             TEXT NOT NULL,
  ref_id                INTEGER NOT NULL,
  display_name          TEXT NOT NULL,
  phone                 TEXT NULL,
  is_active             INTEGER NOT NULL DEFAULT 1,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  UNIQUE(kind, ref_table, ref_id)
);

CREATE INDEX IF NOT EXISTS idx_parties_phone ON rb_parties(phone);

-- 7. Party Credit Profiles & Risk Limits
CREATE TABLE IF NOT EXISTS rb_parties_credit (
  party_id              INTEGER PRIMARY KEY,
  credit_limit          NUMERIC NOT NULL DEFAULT 0.00,
  current_balance       NUMERIC NOT NULL DEFAULT 0.00,
  tier                  TEXT NOT NULL DEFAULT 'retail' CHECK(tier IN ('retail','hawker','distributor','institutional','staff')),
  default_due_days      INTEGER NOT NULL DEFAULT 0,
  hard_stop             INTEGER NOT NULL DEFAULT 1,
  notes                 TEXT NULL,
  updated_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE
);

-- 8. Verified Community Guarantor Registry (Amana Model)
CREATE TABLE IF NOT EXISTS rb_guarantors (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  party_id              INTEGER NOT NULL,
  guarantor_name        TEXT NOT NULL,
  guarantor_phone       TEXT NOT NULL,
  guarantor_address     TEXT NOT NULL,
  community_role        TEXT NULL,
  id_card_ref           TEXT NULL,
  is_active             INTEGER NOT NULL DEFAULT 1,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE
);

-- 9. Device Registry for PWA Offline Terminals
CREATE TABLE IF NOT EXISTS rb_devices (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  device_uuid           TEXT NOT NULL UNIQUE,
  device_name           TEXT NOT NULL,
  user_id               INTEGER NOT NULL,
  last_sync_at          TEXT NULL,
  is_active             INTEGER NOT NULL DEFAULT 1,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
);

-- 10. Offline Sync Ledger (Idempotency Spine)
CREATE TABLE IF NOT EXISTS rb_sync_ledger (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  idempotency_key       TEXT NOT NULL UNIQUE,
  device_id             INTEGER NOT NULL,
  user_id               INTEGER NOT NULL,
  entity_type           TEXT NOT NULL,
  entity_id             INTEGER NULL,
  payload_hash          TEXT NOT NULL,
  client_timestamp      TEXT NOT NULL,
  server_timestamp      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  status                TEXT NOT NULL DEFAULT 'accepted' CHECK(status IN ('accepted','rejected','provisional','conflict')),
  rejection_reason      TEXT NULL
);

-- 11. Operational Event Bus & Audit Trail
CREATE TABLE IF NOT EXISTS rb_event_log (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type            TEXT NOT NULL,
  entity_type           TEXT NOT NULL,
  entity_id             INTEGER NOT NULL,
  actor_user_id         INTEGER NOT NULL,
  device_id             INTEGER NULL,
  payload_json          TEXT NOT NULL,
  gl_journal_id         INTEGER NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

-- 12. Security Audit Log
CREATE TABLE IF NOT EXISTS rb_audit_log (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id               INTEGER NOT NULL,
  action                TEXT NOT NULL,
  entity_type           TEXT NOT NULL,
  entity_id             INTEGER NOT NULL,
  old_values            TEXT NULL,
  new_values            TEXT NULL,
  ip_address            TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
);

-- 13. Cash Drops to Physical Safe
CREATE TABLE IF NOT EXISTS rb_cash_drops (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  shift_id              INTEGER NOT NULL,
  amount                NUMERIC NOT NULL,
  drop_time             TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  received_by           INTEGER NOT NULL,
  witnessed_by          INTEGER NULL,
  gl_journal_id         INTEGER NULL,
  notes                 TEXT NULL,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

-- 14. Daily Physical Stock Counts (No-Lies Sheet)
CREATE TABLE IF NOT EXISTS rb_stock_counts (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_id          TEXT NOT NULL,
  count_date            TEXT NOT NULL,
  item_id               TEXT NOT NULL,
  qty_counted           NUMERIC NOT NULL,
  counted_by            INTEGER NOT NULL,
  notes                 TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  UNIQUE(warehouse_id, count_date, item_id)
);

-- 15. Free Samples & Sadaqah Distribution
CREATE TABLE IF NOT EXISTS rb_free_samples (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  sample_date           TEXT NOT NULL,
  item_id               TEXT NOT NULL,
  qty                   INTEGER NOT NULL,
  recipient_type        TEXT NOT NULL CHECK(recipient_type IN ('driver','guest','mosque_sadaqah','church','staff_taste')),
  recipient_name        TEXT NOT NULL,
  reason                TEXT NOT NULL,
  authorized_by         INTEGER NOT NULL,
  gl_journal_id         INTEGER NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

-- 16. Bank & POS Settlement Files Import Log
CREATE TABLE IF NOT EXISTS rb_settlement_files (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  provider              TEXT NOT NULL CHECK(provider IN ('moniepoint','opay','palmpay','zenith','firstbank')),
  filename              TEXT NOT NULL,
  file_date             TEXT NOT NULL,
  total_amount          NUMERIC NOT NULL,
  matched_amount        NUMERIC NOT NULL DEFAULT 0.00,
  unmatched_count       INTEGER NOT NULL DEFAULT 0,
  uploaded_by           INTEGER NOT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
);

-- 17. Permissions & Roles Matrix
CREATE TABLE IF NOT EXISTS rb_permissions (
  code                  TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  category              TEXT NOT NULL,
  description           TEXT NULL
);

CREATE TABLE IF NOT EXISTS rb_role_permissions (
  role                  TEXT NOT NULL,
  permission_code       TEXT NOT NULL,
  PRIMARY KEY (role, permission_code),
  FOREIGN KEY (permission_code) REFERENCES rb_permissions(code) ON DELETE CASCADE
);

-- 18. Rolling Distributor Bashi Credit Sub-ledger
CREATE TABLE IF NOT EXISTS rb_bashi_ledger (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  party_id              INTEGER NOT NULL,
  entry_date            TEXT NOT NULL,
  event_type            TEXT NOT NULL CHECK(event_type IN ('sale','payment','opening_balance','adjustment','write_off')),
  amount                NUMERIC NOT NULL,
  direction             TEXT NOT NULL CHECK(direction IN ('debit','credit')),
  running_balance       NUMERIC NOT NULL DEFAULT 0.00,
  ref                   TEXT NULL,
  gl_journal_id         INTEGER NULL,
  actor_user_id         INTEGER NOT NULL,
  notes                 TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_bashi_party_date ON rb_bashi_ledger(party_id, entry_date);

-- 19. Split Tender Payments Registry
CREATE TABLE IF NOT EXISTS rb_split_tenders (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id               INTEGER NOT NULL,
  method                TEXT NOT NULL CHECK(method IN ('cash','pos','transfer','bashi','wallet','deposit')),
  amount                NUMERIC NOT NULL,
  pos_terminal_id       TEXT NULL,
  bank_ref              TEXT NULL,
  is_verified           INTEGER NOT NULL DEFAULT 1,
  verified_by           INTEGER NULL,
  gl_journal_id         INTEGER NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_split_sale ON rb_split_tenders(sale_id);

-- 20. Cash Drawer Shifts (Blind Balancing)
CREATE TABLE IF NOT EXISTS rb_cash_shifts (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id               INTEGER NOT NULL,
  device_id             INTEGER NULL,
  opened_at             TEXT NOT NULL,
  closed_at             TEXT NULL,
  opening_float         NUMERIC NOT NULL DEFAULT 0.00,
  expected_cash         NUMERIC NULL,
  actual_cash_counted   NUMERIC NULL,
  variance              NUMERIC NULL,
  variance_reason       TEXT NULL,
  status                TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed','audited')),
  gl_journal_id         INTEGER NULL,
  notes                 TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

-- 21. Physical Crates Master & Asset Tracking
CREATE TABLE IF NOT EXISTS rb_crates (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  code                  TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  capacity_loaves       INTEGER NOT NULL DEFAULT 10,
  deposit_fee           NUMERIC NOT NULL DEFAULT 3500.00,
  replacement_cost      NUMERIC NOT NULL DEFAULT 4500.00,
  is_active             INTEGER NOT NULL DEFAULT 1,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
);

CREATE TABLE IF NOT EXISTS rb_crate_ledger (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  party_id              INTEGER NOT NULL,
  crate_id              INTEGER NOT NULL,
  entry_date            TEXT NOT NULL,
  event_type            TEXT NOT NULL CHECK(event_type IN ('issue_deposit','issue_trust','return','damaged','lost_forfeited')),
  qty_out               INTEGER NOT NULL DEFAULT 0,
  qty_in                INTEGER NOT NULL DEFAULT 0,
  balance_crates        INTEGER NOT NULL DEFAULT 0,
  deposit_amount        NUMERIC NOT NULL DEFAULT 0.00,
  gl_journal_id         INTEGER NULL,
  actor_user_id         INTEGER NOT NULL,
  notes                 TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE,
  FOREIGN KEY (crate_id) REFERENCES rb_crates(id),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

-- 22. Production Flour Batches & Calibrated Loaf Yield Tracking
CREATE TABLE IF NOT EXISTS rb_flour_batches (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_code            TEXT NOT NULL UNIQUE,
  batch_date            TEXT NOT NULL,
  recipe_name           TEXT NOT NULL,
  flour_bags_50kg       INTEGER NOT NULL,
  standard_yield_per_bag INTEGER NOT NULL DEFAULT 85,
  target_loaves         INTEGER NOT NULL,
  actual_good_loaves    INTEGER NOT NULL DEFAULT 0,
  burnt_loaves          INTEGER NOT NULL DEFAULT 0,
  fallen_loaves         INTEGER NOT NULL DEFAULT 0,
  theft_unaccounted     INTEGER NOT NULL DEFAULT 0,
  variance_loaves       INTEGER NOT NULL DEFAULT 0,
  variance_pct          NUMERIC NOT NULL DEFAULT 0.00,
  baker_user_id         INTEGER NOT NULL,
  status                TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('in_prep','baking','completed','audited')),
  gl_journal_id         INTEGER NULL,
  notes                 TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS rb_energy_logs (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  source                TEXT NOT NULL DEFAULT 'generator' CHECK(source IN ('generator','grid','gas','wood')),
  generator_id          INTEGER NULL,
  run_hours_start       NUMERIC NULL,
  run_hours_end         NUMERIC NULL,
  diesel_litres         NUMERIC NULL,
  cost_per_litre        NUMERIC NULL,
  grid_units_kwh        NUMERIC NULL,
  tariff_per_kwh        NUMERIC NULL,
  total_energy_cost     NUMERIC NOT NULL DEFAULT 0.00,
  allocated_batch_id    INTEGER NULL,
  gl_journal_id         INTEGER NULL,
  logged_by             INTEGER NOT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (allocated_batch_id) REFERENCES rb_flour_batches(id) ON DELETE SET NULL,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS rb_waste_returns (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  return_date           TEXT NOT NULL,
  disposition           TEXT NOT NULL CHECK(disposition IN ('counter_discount','feed_conversion','staff_consumption','donation','destroyed')),
  party_id              INTEGER NULL,
  batch_id              INTEGER NULL,
  loaves_qty            INTEGER NOT NULL,
  salvage_amount        NUMERIC NOT NULL DEFAULT 0.00,
  gl_journal_id         INTEGER NULL,
  logged_by             INTEGER NOT NULL,
  notes                 TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE SET NULL,
  FOREIGN KEY (batch_id) REFERENCES rb_flour_batches(id) ON DELETE SET NULL,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS rb_institutional_terms (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  party_id              INTEGER NOT NULL UNIQUE,
  institution_type      TEXT NOT NULL CHECK(institution_type IN ('boarding_school','barracks','hospital','university','government')),
  credit_ceiling        NUMERIC NOT NULL DEFAULT 0.00,
  payment_terms_days    INTEGER NOT NULL DEFAULT 90,
  contract_start        TEXT NOT NULL,
  contract_end          TEXT NOT NULL,
  price_index_rule_json TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rb_delivery_notes (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  note_code             TEXT NOT NULL UNIQUE,
  party_id              INTEGER NOT NULL,
  delivery_date         TEXT NOT NULL,
  loaves_delivered      INTEGER NOT NULL,
  crates_delivered      INTEGER NOT NULL DEFAULT 0,
  signee_name           TEXT NOT NULL,
  signee_title          TEXT NULL,
  signee_signature_ref  TEXT NULL,
  gl_journal_id         INTEGER NULL,
  dispatched_by         INTEGER NOT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE RESTRICT,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS rb_notifications (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  channel               TEXT NOT NULL CHECK(channel IN ('sms','whatsapp','call')),
  template_code         TEXT NOT NULL,
  recipient_type        TEXT NOT NULL CHECK(recipient_type IN ('customer','guarantor','staff')),
  recipient_id          INTEGER NOT NULL,
  phone                 TEXT NOT NULL,
  payload_json          TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','sent','delivered','failed','suppressed')),
  provider              TEXT NULL,
  provider_ref          TEXT NULL,
  scheduled_at          TEXT NULL,
  sent_at               TEXT NULL,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
);

