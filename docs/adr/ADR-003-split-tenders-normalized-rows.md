# ADR-003: Split Tenders as Normalized Rows with Verification States

## Status
Accepted

## Context
In Northern Nigeria, a single wholesale bread sale (e.g. ₦350,000) is commonly paid across multiple methods: cash, Moniepoint POS, instant bank transfer, and rolling debt (*Bashi*). Storing payment methods as flat columns on a sales table breaks down when multiple POS terminals or transfers occur, and leaves the bakery vulnerable to fake SMS alerts.

## Decision
1. **Normalized Tender Rows**: Create `rb_split_tenders` storing individual tender lines per sale.
2. **First-Class Debt Tender**: `debt` is treated as a payment method, posting directly to `rb_bashi_ledger`.
3. **Fake Alert Defense & Suspense Account**:
   - Non-cash tenders default to `verification = 'pending'` unless confirmed via verified webhook or manual cashier check with `verified_by` recorded.
   - Unverified tenders post to `1090 POS/Transfer Suspense` in the GL. Once confirmed, a clearing entry transfers funds to `1040 Operating Checking`.

## Consequences
- Prevents cashiers from booking unverified transfers as liquid bank cash.
- Provides daily settlement reconciliation against Moniepoint/OPay merchant logs.
