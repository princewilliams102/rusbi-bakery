# ADR-006: Blind Cash Balancing, Vault Drops, and Discrepancy Settlements

## Status
Accepted

## Context
Displaying expected cash totals to a cashier at shift close invites manipulation (e.g. skimming cash to match the screen or manufacturing small expenses to hide shortfalls). Additionally, high till balances pose physical security risks during long shifts.

## Decision
1. **Blind Balancing Flow**:
   Cashiers count the physical drawer and submit `actual_cash_counted` blind. The server computes `expected_cash` and reveals the variance only after the count is locked.
2. **Mandatory Variance Reason**:
   Any non-zero variance requires immediate categorization (`change_error`, `unrecorded_expense`, `theft`, `soiled_note_discount`).
3. **Dual-Signatory Cash Drops**:
   When drawer cash exceeds safe operating limits (e.g. ₦500,000), cashiers initiate a safe drop logged in `rb_cash_drops` with both cashier and vault manager signatures, moving funds from `1010 Cash on Hand` to `1020 Cash in Safe`.

## Consequences
- Eliminates end-of-shift till skimming.
- Complete audit trail for intra-day cash movements.
