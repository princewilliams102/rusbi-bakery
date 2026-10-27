# Rusbi Bakery OS — General Ledger Posting Matrix

> **Core Invariant**: Operational events write to sub-ledgers (`rb_split_tenders`, `rb_bashi_ledger`, `rb_crate_ledger`, `rb_flour_batches`, `rb_cash_shifts`). Sub-ledgers post atomically to the General Ledger via `PostingService`. The General Ledger is strictly immutable. Corrections are made via reversing entries (`reverses_journal_id`), never updates or deletes.

---

## 1. General Ledger Accounts Chart (Leaf Accounts)

### Assets (1xxx)
- **1010**: Cash on Hand (Sales Drawer)
- **1020**: Cash in Safe (Vault)
- **1030**: Petty Cash Float
- **1040**: Operating Checking (Zenith Bank Plc - 1014523991)
- **1050**: Moniepoint / OPay POS Clearing
- **1060**: Bank Transfer Clearing (Verified)
- **1090**: Unverified Tender Suspense Account (Fake Alert Defense)
- **1200**: Accounts Receivable — Trade (Bashi Distributors)
- **1210**: Accounts Receivable — Institutional (Schools, Barracks, Hospitals)
- **1220**: Accounts Receivable — Staff IOUs & Wage Advances
- **1300**: Raw Materials Inventory (Flour, Sugar, Margarine, Yeast, Preservatives)
- **1310**: Work-in-Progress Inventory (Dough in Mixer/Proofer)
- **1320**: Finished Goods Inventory (Bread Loaves)
- **1330**: Animal Feed Inventory (Salvage Dried Bread)
- **1340**: Fuel Inventory (Diesel & Petrol in Storage)
- **1400**: Crate Deposit Receivable
- **1500**: Bread Crates (Owned Physical Assets)
- **1510**: Accumulated Depreciation — Crates
- **1600**: Delivery Vehicles
- **1610**: Accumulated Depreciation — Vehicles

### Liabilities (2xxx)
- **2010**: Accounts Payable — Trade (Flour Mills of Nigeria, Dangote Sugar)
- **2020**: Accrued Payroll & Wages
- **2100**: Refundable Crate Deposits Held
- **2110**: Institutional Advance Payments
- **2200**: Value Added Tax (VAT) Payable
- **2210**: Withholding Tax (WHT) Payable

### Equity (3xxx)
- **3010**: Owner's Capital (Alhaji Ibrahim Rusbi)
- **3900**: Opening Balance Equity (Data Migration Clearing)

### Revenue / Income (4xxx)
- **4010**: Commercial Bread Sales (Jumbo, Family, Medium, Coconut, Epic)
- **4020**: Animal Feed Salvage Sales (Dried / Ground Stale Bread)
- **4030**: Forfeited Crate Deposit Recovery
- **4090**: Sundry Other Income

### Cost of Goods Sold & Direct Production (50xx - 51xx)
- **5010**: COGS — Flour (Golden Penny Special 50kg)
- **5011**: COGS — Sugar (Dangote Refined 50kg)
- **5012**: COGS — Margarine & Shortening
- **5013**: COGS — Yeast, Softener & Bread Improver
- **5014**: COGS — Calcium Propionate & Preservatives
- **5015**: COGS — Branded Packaging Nylons & Twist Ties
- **5100**: Direct Production Wages (Mixers, Oven Tenders, Slicers)
- **5101**: Distribution & Dispatch Wages

### Utilities, Fuel & Plant Operations (52xx - 53xx)
- **5200**: Energy — Diesel (Generators & Rotary Burners)
- **5201**: Energy — Grid Electricity (NEPA / Disco Tariffs)
- **5202**: Energy — Industrial Gas / Firewood
- **5203**: Generator Maintenance & Routine Servicing

### Spoilage, Variances & Operating Losses (54xx - 56xx)
- **5400**: Yield Loss — Burnt Loaves
- **5401**: Yield Loss — Fallen / Deformed Dough
- **5402**: Yield Shortfall / Theft Variance
- **5410**: Market Stale Bread Spoilage
- **5500**: Unreturned Crate Asset Loss Expense
- **5600**: Van Sales Cash Shortage / Route Variance
- **5610**: Cash Drawer Short / Over (Till Balancing Variance)

### Administrative, Maintenance & Financials (57xx - 59xx)
- **5700**: Plant Facility Rent & Land Rates
- **5710**: Administrative Salaries
- **5720**: Office & Sundry Supplies
- **5800**: Commercial Bank Charges
- **5810**: Moniepoint / POS Terminal Merchant Fees
- **5900**: Depreciation Expense (Crates & Machinery)

---

## 2. Event-to-Journal Posting Matrix

| Event Type | Sub-Ledger Source | Debit Account | Credit Account | Idempotency Key Rule |
|---|---|---|---|---|
| **Cash Bread Sale** | `rb_split_tenders` | `1010 Cash Drawer` | `4010 Bread Sales` | `sale-{sale_id}-cash` |
| **POS Bread Sale** | `rb_split_tenders` | `1050 POS Clearing` | `4010 Bread Sales` | `sale-{sale_id}-pos` |
| **Bank Transfer Sale (Instant)** | `rb_split_tenders` | `1060 Transfer Clearing` | `4010 Bread Sales` | `sale-{sale_id}-xfer` |
| **Bank Transfer (Unverified / Fake Alert)** | `rb_split_tenders` | `1090 Suspense` | `4010 Bread Sales` | `sale-{sale_id}-susp` |
| **Bashi Credit Sale (Distributor)** | `rb_bashi_ledger` | `1200 AR — Trade` | `4010 Bread Sales` | `sale-{sale_id}-bashi` |
| **Institutional Sale (Net 90)** | `rb_delivery_notes` | `1210 AR — Institutional` | `4010 Bread Sales` | `deliv-{note_id}-ar` |
| **Distributor Debt Repayment (Cash)** | `rb_bashi_ledger` | `1010 Cash Drawer` | `1200 AR — Trade` | `repay-{ledger_id}-cash` |
| **Distributor Debt Repayment (Transfer)** | `rb_bashi_ledger` | `1060 Transfer Clearing` | `1200 AR — Trade` | `repay-{ledger_id}-xfer` |
| **Cash Drop to Safe (Till > ₦500k)** | `rb_cash_drops` | `1020 Cash in Safe` | `1010 Cash Drawer` | `drop-{drop_id}` |
| **Petty Cash Float Issuance** | `rb_petty_cash` | `1030 Petty Cash` | `1010 Cash Drawer` | `petty-{voucher_id}` |
| **Crate Deposit Charged (Untrusted)** | `rb_crate_ledger` | `1010 Cash Drawer` | `2100 Crate Deposits` | `crate-{crate_log_id}-dep` |
| **Crate Deposit Refunded** | `rb_crate_ledger` | `2100 Crate Deposits` | `1010 Cash Drawer` | `crate-{crate_log_id}-ref` |
| **Crate Forfeited / Lost** | `rb_crate_ledger` | `2100 Crate Deposits` | `4030 Crate Recovery` | `crate-{crate_log_id}-loss` |
| **Flour Batch Raw Materials Mix** | `rb_flour_batches` | `1310 Work-in-Progress` | `1300 Raw Materials` | `batch-{batch_id}-mix` |
| **Baking Batch Complete (Good Loaves)** | `rb_flour_batches` | `1320 Finished Bread` | `1310 Work-in-Progress` | `batch-{batch_id}-done` |
| **Baking Burnt Loss** | `rb_flour_batches` | `5400 Yield Loss — Burnt`| `1310 Work-in-Progress` | `batch-{batch_id}-burnt` |
| **Stale Bread -> Animal Feed** | `rb_waste_returns` | `1330 Animal Feed Inv` | `5410 Spoilage Loss` | `salvage-{return_id}` |
| **Staff Salary Advance / IOU** | `rb_staff_ledger` | `1220 AR — Staff` | `1010 Cash Drawer` | `iou-{iou_id}` |
| **Opening Debt Balance Import** | `rb_bashi_ledger` | `1200 AR — Trade` | `3900 Opening Equity` | `open-{party_id}-deb` |

---

## 3. Atomic Transaction Contract

Every module modifying finances MUST follow this caller pattern:

```php
$db->beginTransaction();
try {
    // 1. Record sub-ledger row
    $subLedgerId = $model->insert($data);

    // 2. Post atomic journal entry
    $result = $postingService->post($header, $lines, $idempotencyKey, $eventPayload);

    // 3. Link back journal foreign key
    $model->update($subLedgerId, ['gl_journal_id' => $result['journal_id']]);

    $db->commit();
} catch (Throwable $e) {
    $db->rollBack();
    throw $e;
}
```
