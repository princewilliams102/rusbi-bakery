-- ==============================================================================
-- RUSBI BAKERY OPERATING SYSTEM · SPRINT 0 SCHEMA DDL (MySQL 8.0+ / MariaDB)
-- Hardened General Ledger, Audit Event Bus, Unified Parties & Operational Controls
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. General Ledger Accounts Master
CREATE TABLE IF NOT EXISTS accounts (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code                  VARCHAR(16)     NOT NULL,
  name                  VARCHAR(128)    NOT NULL,
  type                  ENUM('asset','liability','equity','revenue','expense') NOT NULL,
  normal_balance        ENUM('debit','credit') NOT NULL,
  is_leaf               TINYINT(1)      NOT NULL DEFAULT 1,
  parent_id             BIGINT UNSIGNED NULL,
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_code (code),
  KEY idx_parent (parent_id),
  KEY idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Immutable General Ledger Journal Entries (Header)
CREATE TABLE IF NOT EXISTS journal_entries (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  date                  DATE            NOT NULL,           -- Accounting date
  period                CHAR(7)         NOT NULL,           -- 'YYYY-MM' for strict period audit locking
  memo                  VARCHAR(255)    NOT NULL,
  ref                   VARCHAR(64)     NULL,
  source_type           VARCHAR(48)     NOT NULL,           -- 'sale','payment','batch','crate_issue','petty_cash',...
  source_id             BIGINT UNSIGNED NOT NULL,           -- Operational entity ID
  status                ENUM('draft','posted','reversed')
                                        NOT NULL DEFAULT 'posted',
  reverses_journal_id   BIGINT UNSIGNED NULL,               -- Explicit pointer for correction reversals
  created_by            BIGINT UNSIGNED NOT NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_period_status (period, status),
  KEY idx_source (source_type, source_id),
  KEY idx_date (date),
  FOREIGN KEY (reverses_journal_id) REFERENCES journal_entries(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Journal Lines (Details)
CREATE TABLE IF NOT EXISTS journal_lines (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  journal_id            BIGINT UNSIGNED NOT NULL,
  account_id            BIGINT UNSIGNED NOT NULL,           -- Real Foreign Key to accounts table
  account_code_snapshot VARCHAR(16)     NOT NULL,           -- Preserved snapshot for historical audits
  debit                 DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  credit                DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  memo                  VARCHAR(255)    NULL,
  KEY idx_journal (journal_id),
  KEY idx_account_period (account_id),
  FOREIGN KEY (journal_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Idempotency Registry for General Ledger Postings
CREATE TABLE IF NOT EXISTS journal_idempotency (
  idempotency_key       CHAR(36)        NOT NULL PRIMARY KEY,
  journal_id            BIGINT UNSIGNED NOT NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (journal_id) REFERENCES journal_entries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Materialized Account Balance Cache (Owned Exclusively by Cron)
CREATE TABLE IF NOT EXISTS account_balances_cache (
  account_id            BIGINT UNSIGNED NOT NULL,
  period                CHAR(7)         NOT NULL,
  debit_total           DECIMAL(18,2)   NOT NULL DEFAULT 0.00,
  credit_total          DECIMAL(18,2)   NOT NULL DEFAULT 0.00,
  balance               DECIMAL(18,2)   NOT NULL DEFAULT 0.00, -- Signed per normal balance
  refreshed_at          DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (account_id, period),
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Unified Parties Mapping Layer (Preserves Existing Customers/Vendors/Users)
CREATE TABLE IF NOT EXISTS rb_parties (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kind                  ENUM('customer','vendor','staff','guarantor','agent') NOT NULL,
  ref_table             VARCHAR(32)     NOT NULL,   -- 'customers','vendors','users'
  ref_id                BIGINT UNSIGNED NOT NULL,
  display_name          VARCHAR(255)    NOT NULL,
  phone                 VARCHAR(32)     NULL,
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_kind_ref (kind, ref_table, ref_id),
  KEY idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Party Credit Profiles & Risk Limits
CREATE TABLE IF NOT EXISTS rb_parties_credit (
  party_id              BIGINT UNSIGNED PRIMARY KEY,
  credit_limit          DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  current_balance       DECIMAL(15,2)   NOT NULL DEFAULT 0.00, -- Authoritative source remains sum of bashi ledger
  tier                  ENUM('retail','hawker','distributor','institutional','staff')
                                        NOT NULL DEFAULT 'retail',
  default_due_days      INT             NOT NULL DEFAULT 0,    -- 0 = rolling Bashi
  hard_stop             TINYINT(1)      NOT NULL DEFAULT 1,    -- 1 = freeze dispatch; 0 = PIN override
  notes                 TEXT            NULL,
  updated_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Verified Community Guarantor Registry (Amana Model)
CREATE TABLE IF NOT EXISTS rb_guarantors (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  party_id              BIGINT UNSIGNED NOT NULL,              -- Link to distributor
  guarantor_name        VARCHAR(128)    NOT NULL,
  guarantor_phone       VARCHAR(32)     NOT NULL,
  guarantor_address     VARCHAR(255)    NOT NULL,
  community_role        VARCHAR(128)    NULL,                  -- e.g. 'Chairman Bread Sellers Association'
  id_card_ref           VARCHAR(64)     NULL,                  -- NIN / Voter card number
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_party (party_id),
  KEY idx_phone (guarantor_phone),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Device Registry for PWA Offline Terminals
CREATE TABLE IF NOT EXISTS rb_devices (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_uuid           CHAR(36)        NOT NULL UNIQUE,
  device_name           VARCHAR(64)     NOT NULL,              -- e.g. 'Counter POS 1', 'Van 2 Dispatch'
  user_id               BIGINT UNSIGNED NOT NULL,
  last_sync_at          DATETIME(3)     NULL,
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Offline Sync Ledger (Idempotency Spine for PWA POSTs)
CREATE TABLE IF NOT EXISTS rb_sync_ledger (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idempotency_key       CHAR(36)        NOT NULL UNIQUE,       -- Client-generated UUIDv4
  device_id             BIGINT UNSIGNED NOT NULL,
  user_id               BIGINT UNSIGNED NOT NULL,
  entity_type           VARCHAR(64)     NOT NULL,              -- 'sale','payment','crate_return','shift_close'
  entity_id             BIGINT UNSIGNED NULL,                  -- Assigned server ID
  payload_hash          CHAR(64)        NOT NULL,              -- SHA-256 canonical hash
  client_timestamp      DATETIME(3)     NOT NULL,
  server_timestamp      DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  status                ENUM('accepted','rejected','provisional','conflict')
                                        NOT NULL DEFAULT 'accepted',
  rejection_reason      VARCHAR(255)    NULL,
  KEY idx_entity (entity_type, entity_id),
  KEY idx_device_time (device_id, client_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Operational Event Bus & Audit Trail
CREATE TABLE IF NOT EXISTS rb_event_log (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type            VARCHAR(64)     NOT NULL,              -- 'sale_created','bashi_debited','crate_issued',...
  entity_type           VARCHAR(64)     NOT NULL,
  entity_id             BIGINT UNSIGNED NOT NULL,
  actor_user_id         BIGINT UNSIGNED NOT NULL,
  device_id             BIGINT UNSIGNED NULL,
  payload_json          JSON            NOT NULL,              -- Canonical immutable snapshot
  gl_journal_id         BIGINT UNSIGNED NULL,                  -- Double-entry link
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_entity (entity_type, entity_id),
  KEY idx_event_time (event_type, created_at),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Security Audit Log
CREATE TABLE IF NOT EXISTS rb_audit_log (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id               BIGINT UNSIGNED NOT NULL,
  action                VARCHAR(64)     NOT NULL,              -- 'credit_override','void_sale','price_change'
  entity_type           VARCHAR(64)     NOT NULL,
  entity_id             BIGINT UNSIGNED NOT NULL,
  old_values            JSON            NULL,
  new_values            JSON            NULL,
  ip_address            VARCHAR(45)     NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_user_action (user_id, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Cash Drops to Physical Safe
CREATE TABLE IF NOT EXISTS rb_cash_drops (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shift_id              BIGINT UNSIGNED NOT NULL,
  amount                DECIMAL(15,2)   NOT NULL,
  drop_time             DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  received_by           BIGINT UNSIGNED NOT NULL,              -- Safe custodian
  witnessed_by          BIGINT UNSIGNED NULL,                  -- Secondary witness
  gl_journal_id         BIGINT UNSIGNED NULL,                  -- D 1020 Safe / C 1010 Drawer
  notes                 VARCHAR(255)    NULL,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Daily Physical Stock Counts (Storekeeper Blind Entry for No-Lies Sheet)
CREATE TABLE IF NOT EXISTS rb_stock_counts (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  warehouse_id          VARCHAR(32)     NOT NULL,              -- 'finished_goods','raw_store','van_transit'
  count_date            DATE            NOT NULL,
  item_id               VARCHAR(64)     NOT NULL,
  qty_counted           DECIMAL(12,2)   NOT NULL,
  counted_by            BIGINT UNSIGNED NOT NULL,
  notes                 VARCHAR(255)    NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_wh_date_item (warehouse_id, count_date, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Free Samples & Sadaqah Distribution (Distinguished from Theft/Unaccounted)
CREATE TABLE IF NOT EXISTS rb_free_samples (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sample_date           DATE            NOT NULL,
  item_id               VARCHAR(64)     NOT NULL,
  qty                   INT             NOT NULL,
  recipient_type        ENUM('driver','guest','mosque_sadaqah','church','staff_taste') NOT NULL,
  recipient_name        VARCHAR(128)    NOT NULL,
  reason                VARCHAR(255)    NOT NULL,
  authorized_by         BIGINT UNSIGNED NOT NULL,
  gl_journal_id         BIGINT UNSIGNED NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Bank & POS Settlement Files Import Log
CREATE TABLE IF NOT EXISTS rb_settlement_files (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider              ENUM('moniepoint','opay','palmpay','zenith','firstbank') NOT NULL,
  filename              VARCHAR(128)    NOT NULL,
  file_date             DATE            NOT NULL,
  total_amount          DECIMAL(15,2)   NOT NULL,
  matched_amount        DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  unmatched_count       INT             NOT NULL DEFAULT 0,
  uploaded_by           BIGINT UNSIGNED NOT NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Permissions & Roles Matrix
CREATE TABLE IF NOT EXISTS rb_permissions (
  code                  VARCHAR(48)     PRIMARY KEY,
  name                  VARCHAR(128)    NOT NULL,
  category              VARCHAR(48)     NOT NULL,
  description           VARCHAR(255)    NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rb_role_permissions (
  role                  VARCHAR(32)     NOT NULL,
  permission_code       VARCHAR(48)     NOT NULL,
  PRIMARY KEY (role, permission_code),
  FOREIGN KEY (permission_code) REFERENCES rb_permissions(code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Rolling Distributor Bashi Credit Sub-ledger
CREATE TABLE IF NOT EXISTS rb_bashi_ledger (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  party_id              BIGINT UNSIGNED NOT NULL,
  entry_date            DATE            NOT NULL,
  event_type            ENUM('sale','payment','opening_balance','adjustment','write_off') NOT NULL,
  amount                DECIMAL(15,2)   NOT NULL,
  direction             ENUM('debit','credit') NOT NULL,
  running_balance       DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  ref                   VARCHAR(64)     NULL,
  gl_journal_id         BIGINT UNSIGNED NULL,
  actor_user_id         BIGINT UNSIGNED NOT NULL,
  notes                 VARCHAR(255)    NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_bashi_party (party_id, entry_date),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Split Tender Payments Registry
CREATE TABLE IF NOT EXISTS rb_split_tenders (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id               BIGINT UNSIGNED NOT NULL,
  method                ENUM('cash','pos','transfer','bashi','wallet','deposit') NOT NULL,
  amount                DECIMAL(15,2)   NOT NULL,
  pos_terminal_id       VARCHAR(64)     NULL,
  bank_ref              VARCHAR(64)     NULL,
  is_verified           TINYINT(1)      NOT NULL DEFAULT 1,
  verified_by           BIGINT UNSIGNED NULL,
  gl_journal_id         BIGINT UNSIGNED NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_split_sale (sale_id),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Cash Drawer Shifts (Blind Balancing)
CREATE TABLE IF NOT EXISTS rb_cash_shifts (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id               BIGINT UNSIGNED NOT NULL,
  device_id             BIGINT UNSIGNED NULL,
  opened_at             DATETIME(3)     NOT NULL,
  closed_at             DATETIME(3)     NULL,
  opening_float         DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  expected_cash         DECIMAL(15,2)   NULL,
  actual_cash_counted   DECIMAL(15,2)   NULL,
  variance              DECIMAL(15,2)   NULL,
  variance_reason       VARCHAR(255)    NULL,
  status                ENUM('open','closed','audited') NOT NULL DEFAULT 'open',
  gl_journal_id         BIGINT UNSIGNED NULL,
  notes                 VARCHAR(255)    NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Physical Crates Master & Asset Tracking
CREATE TABLE IF NOT EXISTS rb_crates (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code                  VARCHAR(32)     NOT NULL,
  name                  VARCHAR(128)    NOT NULL,
  capacity_loaves       INT             NOT NULL DEFAULT 10,
  deposit_fee           DECIMAL(15,2)   NOT NULL DEFAULT 3500.00,
  replacement_cost      DECIMAL(15,2)   NOT NULL DEFAULT 4500.00,
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_crate_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rb_crate_ledger (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  party_id              BIGINT UNSIGNED NOT NULL,
  crate_id              BIGINT UNSIGNED NOT NULL,
  entry_date            DATE            NOT NULL,
  event_type            ENUM('issue_deposit','issue_trust','return','damaged','lost_forfeited') NOT NULL,
  qty_out               INT             NOT NULL DEFAULT 0,
  qty_in                INT             NOT NULL DEFAULT 0,
  balance_crates        INT             NOT NULL DEFAULT 0,
  deposit_amount        DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  gl_journal_id         BIGINT UNSIGNED NULL,
  actor_user_id         BIGINT UNSIGNED NOT NULL,
  notes                 VARCHAR(255)    NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE,
  FOREIGN KEY (crate_id) REFERENCES rb_crates(id),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Production Flour Batches & Calibrated Loaf Yield Tracking
CREATE TABLE IF NOT EXISTS rb_flour_batches (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  batch_code            VARCHAR(64)     NOT NULL,
  batch_date            DATE            NOT NULL,
  recipe_name           VARCHAR(128)    NOT NULL,
  flour_bags_50kg       INT             NOT NULL,
  standard_yield_per_bag INT            NOT NULL DEFAULT 85,
  target_loaves         INT             NOT NULL,
  actual_good_loaves    INT             NOT NULL DEFAULT 0,
  burnt_loaves          INT             NOT NULL DEFAULT 0,
  fallen_loaves         INT             NOT NULL DEFAULT 0,
  theft_unaccounted     INT             NOT NULL DEFAULT 0,
  variance_loaves       INT             NOT NULL DEFAULT 0,
  variance_pct          DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
  baker_user_id         BIGINT UNSIGNED NOT NULL,
  status                ENUM('in_prep','baking','completed','audited') NOT NULL DEFAULT 'completed',
  gl_journal_id         BIGINT UNSIGNED NULL,
  notes                 VARCHAR(255)    NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_batch_code (batch_code),
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rb_energy_logs (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  source                ENUM('generator','grid','gas','wood') NOT NULL DEFAULT 'generator',
  generator_id          BIGINT UNSIGNED NULL,
  run_hours_start       DECIMAL(10,2)   NULL,
  run_hours_end         DECIMAL(10,2)   NULL,
  diesel_litres         DECIMAL(10,2)   NULL,
  cost_per_litre        DECIMAL(10,2)   NULL,
  grid_units_kwh        DECIMAL(10,2)   NULL,
  tariff_per_kwh        DECIMAL(10,2)   NULL,
  total_energy_cost     DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  allocated_batch_id    BIGINT UNSIGNED NULL,
  gl_journal_id         BIGINT UNSIGNED NULL,
  logged_by             BIGINT UNSIGNED NOT NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (allocated_batch_id) REFERENCES rb_flour_batches(id) ON DELETE SET NULL,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rb_waste_returns (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  return_date           DATE            NOT NULL,
  disposition           ENUM('counter_discount','feed_conversion','staff_consumption','donation','destroyed') NOT NULL,
  party_id              BIGINT UNSIGNED NULL,
  batch_id              BIGINT UNSIGNED NULL,
  loaves_qty            INT             NOT NULL,
  salvage_amount        DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  gl_journal_id         BIGINT UNSIGNED NULL,
  logged_by             BIGINT UNSIGNED NOT NULL,
  notes                 VARCHAR(255)    NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE SET NULL,
  FOREIGN KEY (batch_id) REFERENCES rb_flour_batches(id) ON DELETE SET NULL,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rb_institutional_terms (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  party_id              BIGINT UNSIGNED NOT NULL UNIQUE,
  institution_type      ENUM('boarding_school','barracks','hospital','university','government') NOT NULL,
  credit_ceiling        DECIMAL(15,2)   NOT NULL DEFAULT 0.00,
  payment_terms_days    INT             NOT NULL DEFAULT 90,
  contract_start        DATE            NOT NULL,
  contract_end          DATE            NOT NULL,
  price_index_rule_json JSON            NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rb_delivery_notes (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  note_code             VARCHAR(64)     NOT NULL UNIQUE,
  party_id              BIGINT UNSIGNED NOT NULL,
  delivery_date         DATE            NOT NULL,
  loaves_delivered      INT             NOT NULL,
  crates_delivered      INT             NOT NULL DEFAULT 0,
  signee_name           VARCHAR(128)    NOT NULL,
  signee_title          VARCHAR(128)    NULL,
  signee_signature_ref  VARCHAR(255)    NULL,
  gl_journal_id         BIGINT UNSIGNED NULL,
  dispatched_by         BIGINT UNSIGNED NOT NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (party_id) REFERENCES rb_parties(id) ON DELETE RESTRICT,
  FOREIGN KEY (gl_journal_id) REFERENCES journal_entries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rb_notifications (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  channel               ENUM('sms','whatsapp','call') NOT NULL,
  template_code         VARCHAR(64)     NOT NULL,
  recipient_type        ENUM('customer','guarantor','staff') NOT NULL,
  recipient_id          BIGINT UNSIGNED NOT NULL,
  phone                 VARCHAR(32)     NOT NULL,
  payload_json          JSON            NOT NULL,
  status                ENUM('queued','sent','delivered','failed','suppressed') NOT NULL DEFAULT 'queued',
  provider              VARCHAR(32)     NULL,
  provider_ref          VARCHAR(128)    NULL,
  scheduled_at          DATETIME(3)     NULL,
  sent_at               DATETIME(3)     NULL,
  created_at            DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_status_scheduled (status, scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
