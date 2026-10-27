# Rusbi Books: General Ledger Posting Matrix & Accounting Contract

> **MANDATORY CONTRACT**: Operational events write to sub-ledgers. Sub-ledgers post to the GL via `PostingService`. 
> Nothing posts to the GL directly except journal entries and correction reversals. The GL is immutable except by reversing entry.

---

## 1. Double-Entry Posting Matrix

| Event | Debit | Credit | Notes |
|---|---|---|---|
| **Cash Sale** | 1010 Cash on Hand (Drawer) | 4010 Bread Sales | Physical cash collected in drawer |
| **POS Sale** | 1050 POS Clearing | 4010 Bread Sales | Moniepoint/OPay card settlement |
| **Direct Bank Transfer Sale** | 1060 Wallet / Bank Clearing | 4010 Bread Sales | Instant bank transfer |
| **Credit (*Bashi*) Sale** | 1200 Accounts Receivable — Trade | 4010 Bread Sales | Fires `rb_bashi_ledger` debit entry |
| **Unverified Tender Sale** | 1090 POS/Transfer Suspense | 4010 Bread Sales | Held in suspense until verified |
| **Debt Settlement — Cash** | 1010 Cash on Hand | 1200 Accounts Receivable | Fires `rb_bashi_ledger` credit entry |
| **Debt Settlement — POS** | 1050 POS Clearing | 1200 Accounts Receivable | Clears AR upon POS confirmation |
| **Debt Settlement — Transfer** | 1060 Wallet Clearing | 1200 Accounts Receivable | Clears AR upon transfer confirmation |
| **Crate Issue (Deposit Mode)** | 1400 Crate Deposit Receivable | 2100 Refundable Crate Deposits | Casual customer deposit; physical tracked in `rb_crate_ledger` |
| **Crate Return (Deposit Mode)** | 2100 Refundable Crate Deposits | 1400 Crate Deposit Receivable | Cash refunded or credit reversed |
| **Crate Issue (Trust Mode)** | *No GL posting* | *No GL posting* | Tracked physically in `rb_crate_ledger` units only |
| **Crate Deposit Forfeit** | 2100 Refundable Crate Deposits | 4030 Crate Loss Recovery | Customer fails to return crate; deposit recognized as other income |
| **Crate Physical Write-Down** | 5500 Crate Loss Expense | 1500 Crates (Owned) | Crates destroyed or lost |
| **Flour & Ingredient Purchase** | 1300 Raw Materials Inventory | 2010 Accounts Payable / 1040 Checking | Standard vendor procurement |
| **Batch Start (WIP Incurred)** | 1310 Work-in-Progress Inventory | 1300 Raw Materials Inventory | FIFO cost pulled from recipe BOM |
| **Batch Complete (Finished Goods)**| 1320 Finished Goods Inventory | 1310 Work-in-Progress Inventory | Cost = Raw materials consumed + energy allocation |
| **Yield Variance — Shortfall/Theft** | 5402 Yield Loss — Theft/Shortfall | 1310 Work-in-Progress Inventory | Shortfall beyond 2% threshold |
| **Yield Variance — Burnt Loaves** | 5400 Yield Loss — Burnt | 1310 Work-in-Progress Inventory | Oven heat defects |
| **Yield Variance — Fallen Dough** | 5401 Yield Loss — Fallen | 1310 Work-in-Progress Inventory | Proofing or handling defects |
| **Stale Bread to Animal Feed** | 1330 Feed Inventory (Salvage Value) + 5410 Spoilage Loss (Delta) | 1320 Finished Goods Inventory | Converts unsaleable bread to animal feed |
| **Animal Feed Sale** | 1010 Cash on Hand / 1200 AR | 4020 Feed Sales | Salvage recovery revenue |
| **Fuel / Diesel Purchase** | 1340 Fuel Inventory | 1040 Operating Checking / 2010 AP | Bulk diesel tank refills |
| **Fuel Consumed in Production** | 5200 Energy — Diesel | 1340 Fuel Inventory | Allocated to batch WIP cost |
| **Generator Servicing** | 5203 Generator Maintenance | 1010 Cash / 1040 Checking | Triggered every 250 operational hours |
| **Petty Cash Float Replenish** | 1030 Petty Cash Float | 1010 Cash on Hand / 1040 Checking | From main cash till or bank |
| **Petty Cash Expense Voucher** | 5720 Office & Sundry (or respective) | 1030 Petty Cash Float | Receipt-backed voucher |
| **Staff Advance / IOU Issued** | 1220 Accounts Receivable — Staff | 1030 Petty Cash / 1010 Cash | Logged in `rb_staff_ledger` |
| **Payroll IOU Auto-Deduction** | 2020 Accrued Wages | 1220 Accounts Receivable — Staff | Offsets IOU against wage run |
| **Institutional Delivery Note** | 1210 AR — Institutional + 1700 WHT Receivable | 4010 Bread Sales | Invoiced at billing cycle end |
| **Cash Drop to Safe** | 1020 Cash in Safe | 1010 Cash on Hand (Drawer) | Dual-signatory intra-day till drop |
| **Route Cash Shortage** | 5600 Route Loss / Cash Variance | 1050 Route Cash Clearing | Discrepancy at driver check-in |

---

## 2. The Inviolable Posting Rules

1. **Balance Rule**: Every journal entry MUST balance: $\sum \text{Debit} = \sum \text{Credit}$.
2. **Leaf Account Rule**: Only leaf accounts (accounts with no child sub-accounts) can receive journal lines.
3. **No Direct Account Balance Mutation**: The `accounts` table has no authoritative `balance` column. All balances are derived dynamically from `journal_lines`, and cached in `account_balances_cache` via background materialized views.
4. **Correction by Reversal Only**: Posted journals cannot be edited or deleted. Corrections must issue a reversing journal pointing to `reverses_journal_id`.
