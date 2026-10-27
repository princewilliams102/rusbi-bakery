# ADR-004: Crates as a Two-Way Asset and Refundable Deposit Liability

## Status
Accepted

## Context
Commercial bread crates cost ₦3,000–₦6,000 each. Bakeries dispatching 500 crates daily face severe capital loss if unreturned crates are not tracked. Casual buyers must pay a refundable deposit, while trusted distributors operate on physical unit balance exchange.

## Decision
1. **Two-Way Line Item**: Every dispatch tracks both finished bread (revenue/cash) and crate units (physical asset movement).
2. **Dual Mode Accounting**:
   - **Deposit Mode**: Posts `1400 Crate Deposit Receivable` (Asset) and `2100 Refundable Crate Deposits` (Liability). If forfeited, moves to `4030 Crate Loss Recovery` (Income).
   - **Trust Mode**: Tracks unit balances strictly in `rb_crate_ledger` without financial GL posting until damage or permanent loss is recognized.
3. **Checkout Swap Enforcement**: The POS blocks new crate dispatch if customer's outstanding crate balance exceeds threshold without matching return or deposit.

## Consequences
- Prevents overstating revenue with customer deposit money.
- Real-time visibility into total crate asset exposure in the field.
