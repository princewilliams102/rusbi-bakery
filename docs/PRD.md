# Rusbi Bakery: Product Requirements Document (PRD)
## Operational Context & Domain Requirements for Northern Nigeria

---

## 1. Operational Ecosystem & Key Actors

Operating in Northern Nigerian commercial bakery hubs (Kano, Kaduna, Sokoto, Maiduguri, Jos, Zaria) requires adapting to extreme physical cash reliance, trust-based informal credit (*Amana* / *Bashi*), high ambient heat and humidity, volatile ingredient prices, unstable electricity grids, and frequent staff turnover.

```
                       ┌──────────────────────┐
                       │   Owner / Manager    │
                       └──────────┬───────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Chief Baker /   │    │ Dispatch / Store │    │ Cashier / POS /  │
│  Production Head │    │      Keeper      │    │ Sales Supervisor │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
 ┌───────┴───────┐        ┌──────┴───────┐        ┌──────┴───────┐
 │ Mixers, Oven  │        │ Crates/Van   │        │ Masu Sari    │
 │ Tenders,      │        │ Loaders,     │        │ Retailers,   │
 │ Slicers       │        │ Drivers      │        │ Mai Shayi    │
 └───────────────┘        └──────────────┘        └──────────────┘
```

### Key Personas
1. **The Owner / General Manager**: Real-time visibility into daily net cash, bank balances, crate asset exposure, Bashi debt aging, and production yield variances.
2. **The Chief Baker (Head of Production)**: Directs mixing formulas, proofing times, batch output, and shift workers (frequently compensated per 50kg bag of flour processed).
3. **The Storekeeper**: Custodian of raw materials (flour, sugar, yeast, margarine, nylons) and finished bread stock.
4. **The Sales / Dispatch Clerks**: Allocates loaves to distributors, verifies crate returns, records multi-tender payments, and logs credit tickets.
5. **The Mai Sari (Wholesale Distributor)**: Buys 50–500 loaves daily. Takes fresh bread at dawn (5:00 AM) on credit (*Bashi*) and settles late afternoon, maintaining a rolling balance.
6. **The Mai Shayi (Tea & Bread Vendor)**: Takes 10–30 loaves daily on micro-credit cycles of 2–3 days.
7. **Institutional Buyers**: Boarding schools, military garrisons, hospitals, and universities. Buy hundreds of loaves daily under "Buy Now, Pay Months Later" contractual agreements.

---

## 2. Production Tracking & Bill of Materials (BOM)

Flour is the base currency. Bread yields dictate gross margins. If flour is pilfered or batch hydration diluted, profitability evaporates.

### A. Raw Materials Inventory
- **Flour**: 50kg bags (Dangote, Golden Penny, Mama Gold, Honeywell).
- **Sugar**: 50kg industrial bags (Dangote).
- **Industrial Margarine / Shortening**: 15kg/20kg cartons.
- **Yeast**: Instant dry yeast (cartons of 500g sachets).
- **Bread Improver & Conditioners**: Tins or sachets.
- **Preservatives**: Calcium Propionate (mandatory in Northern Nigeria's heat).
- **Flavoring & Salt**: Liquid/powder flavors, refined iodized salt.
- **Packaging**: Branded printed nylons (Jumbo, Family, Medium), inner wax paper, twist ties.
- **Energy & Utilities**: Diesel (litres), petrol (PMS), firewood, industrial gas, grid electricity units (NEPA/Disco).

### B. Yield Formula & Variance Logic
$$\text{Expected Yield per Bag} = \frac{\text{Standard Loaves Baked}}{\text{50kg Flour Bag}}$$
- Standard calibrated yield constant (calibrated by physical trial, e.g. 125 loaves of 800g bread per 50kg bag).
- Variance / Deficit: $\text{Actual} - \text{Expected}$. Must be strictly categorized as *burnt*, *fallen dough*, *slicing defect*, or *theft/unaccounted shortfall*.
- Trigger warning if yield drops $>2\%$ below calibrated expectation.

---

## 3. Cash Management, POS & Split Payments

```
                  ┌──────────────────────────────────────────┐
                  │          Point of Sale / Order           │
                  └────────────────────┬─────────────────────┘
                                       │
     ┌──────────────────┬──────────────┴─────┬──────────────────┐
     ▼                  ▼                    ▼                  ▼
┌─────────┐      ┌─────────────┐      ┌─────────────┐     ┌───────────┐
│ Cash in │      │ Direct Bank │      │ POS Terminal│     │ Debt /    │
│  Hand   │      │  Transfer   │      │ (Moniepoint/│     │  Ledger   │
│         │      │             │      │    OPay)    │     │  (Bashi)  │
└────┬────┘      └──────┬──────┘      └──────┬──────┘     └─────┬─────┘
     │                  │                    │                  │
     │                  ▼                    │                  │
     │          Fake Alert / Network         │                  │
     │          Downtime Protocol            │                  │
     │                  │                    │                  │
     └──────────────────┼────────────────────┴──────────────────┘
                        ▼
       ┌───────────────────────────────────┐
       │   Daily End-of-Shift Cash Drop    │
       │     & Discrepancy Settlement      │
       └───────────────────────────────────┘
```

- **Split Payments**: Single order can combine physical cash + Moniepoint POS + OPay transfer + Bashi credit.
- **Fake Alert Defense**: Bank transfers must capture Session ID / Reference Number and remain in a verification queue. Unverified non-cash tenders sit in a `POS/Transfer Suspense` GL account until confirmed.
- **Blind Cash Shift Balancing**: Cashiers enter counted cash without seeing system expected cash. Variances require mandatory justification.
- **Soiled / Damaged Notes (*Kudin Yage*)**: Log mutilated notes accepted at a discount or separated for Central Bank return.
- **Intra-Day Safe Drops**: Cashiers transfer excess cash from drawer to secure physical vault (`rb_cash_drops`).

---

## 4. Debt Management: Bashi, Institutional Accounts & Staff IOUs

- **Distributor Credit (*Masu Sari*)**:
  - Daily/weekly rolling settlement.
  - Dynamic credit limits with hard stop (blocks dispatch) vs soft stop (requires manager PIN override).
  - *Amana* guarantee model: linked to verified guarantor (*Wakili* / elder / association leader) with phone and physical address.
- **Institutional BNPL Accounts**:
  - Formal contracts with credit ceilings (e.g. ₦15,000,000, 30–90 day net terms).
  - Daily delivery slips signed by mess officer/storekeeper.
  - Monthly aggregation into master tax invoices with Withholding Tax (WHT) certificate tracking.
  - Price-indexing clause DSL to adjust price dynamically if flour costs shift.
- **Internal Staff IOUs**:
  - Advance loans issued from petty cash float.
  - Auto-deducted at weekly/monthly wage generation.

---

## 5. Crate Management (*Kayan Saka Burodi*)

```
[ Bakery Warehouse ] ──( 100 Loaves in 10 Crates )──► [ Distributor ]
         ▲                                                    │
         │                                                    │
         └───────────( Returns 8 Empty Crates )───────────────┘
                                  │
                         [ 2 Crates Missing ]
                                  │
                      ┌───────────┴───────────┐
                      ▼                       ▼
              Crate Debt Tracked       ₦8,000 Deducted
                in Ledger or...        from Cash Margin
```

- Two-way ledger: Every dispatch records bread loaves (inventory/cash value) and physical crates (asset units).
- Deposit Mode vs Trust Mode: Refundable crate deposits for casual buyers; physical crate ledger balance tracking for trusted distributors.
- Swap enforcement at checkout.

---

## 6. Perishable Waste, Stale Bread & Salvage Feed

- **Factory Rejects**: Deformed, unevenly sliced, or lightly burnt loaves sold same day at counter discount.
- **Market Returns (Stale)**: Unsold bread returned after 3–4 days.
- **Animal Feed Conversion**: Dried, bagged, and sold to poultry, fish, and livestock farmers at salvage value, balancing production waste.

---

## 7. Energy & Generator Tracking Engine

Diesel and power utilities represent 30%–45% of production cost.
- Generator runtime logbook: hours run, fuel added, cost per litre.
- Grid electricity meter readings: NEPA/Disco kWh units vs tariff band.
- 250-hour generator service cycle automated alert.
- Energy cost allocation: Pro-rated across batches to compute true Cost Per Loaf (CPL).

---

## 8. Essential Reports

1. **Daily Reconciliation Matrix (The "No-Lies" Sheet)**:
   Flour Mixed vs Bread Bagged vs Accounted (Sold + Free Samples + Stale + Damaged + Closing Count). Identifies unaccounted theft instantly.
2. **Daily Cash Box Settlement**:
   Opening Float + Cash Sales + Cash Debt Recoveries - Refunds - Petty Cash - Safe Drops = Expected Cash vs Counted Cash.
3. **Aging Debt Register (*Takardar Masu Bashi*)**:
   Bucketed aging per tier (Retail, Distributor, Institutional, Staff).
4. **Crate Deficit Ledger**:
   Outstanding crates held in field grouped by customer and phone number.

---

## 9. Practical Regional UX

- **Dual Language**: Hausa & English interface toggles.
- **Offline-First PWA**: Operates locally through IndexedDB with queued sync to server.
- **Receipts with QR Code**: Offline-signed cryptographic verification.
- **SMS / WhatsApp Alerts**: Instant notification to customer and guarantor on debt movements.
