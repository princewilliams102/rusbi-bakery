# ADR-002: Parties Mapping (`rb_parties`) Rather Than Merging Existing Customers & Vendors

## Status
Accepted

## Context
Bakery customers (distributors) are frequently also suppliers (e.g. returning stale bread for animal feed credit, or supplying packaging materials). However, the existing QuickBooks clone already has active tables for `customers` and `vendors`, referenced by historical invoices, payments, and bills. Renaming or merging these tables would break existing foreign keys and risk severe schema regression.

## Decision
1. **Preserve Existing Tables**: Leave `customers` and `vendors` tables intact with their primary keys.
2. **Introduce Mapping Table**: Create `rb_parties`:
   ```sql
   CREATE TABLE rb_parties (
     id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
     kind          ENUM('customer','vendor','staff','guarantor','agent') NOT NULL,
     ref_table     VARCHAR(32)     NOT NULL,
     ref_id        BIGINT UNSIGNED NOT NULL,
     display_name  VARCHAR(255)    NOT NULL,
     phone         VARCHAR(32)     NULL,
     is_active     TINYINT(1)      NOT NULL DEFAULT 1,
     created_at    DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
     UNIQUE KEY uq_kind_ref (kind, ref_table, ref_id)
   );
   ```
3. **New Modules Target `rb_parties`**: All new bakery sub-ledgers (`rb_bashi_ledger`, `rb_crate_ledger`, `rb_guarantors`, `rb_staff_ledger`) reference `rb_parties.id`.

## Consequences
- Zero migration risk for existing transactions.
- A single physical entity can hold both customer and vendor roles cleanly.
- Forward-compatible with future unified party architectures.
