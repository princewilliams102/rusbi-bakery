# Rusbi Bakery: PRD → TDD Traceability Matrix

| PRD § | Requirement | TDD Implementation Location | Status | Sprint |
|---|---|---|---|---|
| **§1** | Personas (Owner, GM, Chief Baker, Storekeeper, Dispatch, Cashier, Van Agent) | `rb_permissions`, `rb_role_permissions`, PWA persona screens | ✅ Implemented in Sprint 0 | Sprint 0 |
| **§2A** | Raw materials (Flour, Sugar, Margarine, Yeast, Improver, Preservatives, Salt, Nylons, Wrappers) | Standardized `items` catalog + `rb_recipe_lines` | ✅ Covered | Sprint 0 / 4 |
| **§2A** | Energy sources (Diesel, PMS, Firewood, Gas, Grid NEPA/Disco) | `rb_energy_logs (source: generator, grid, gas, wood)`, `rb_generators` | ✅ Covered | Sprint 0 / 4 |
| **§2B** | Yield formula (Loaves per 50kg bag, categorizing variance: burnt/fallen/stolen, >2% alert) | `rb_recipes.loaves_per_bag`, `rb_production_batches`, `rb_yield_variances` | ✅ Covered | Sprint 4 |
| **§3A** | Split payment engine (Cash + POS + Transfer + Bashi) | `rb_split_tenders` | ✅ Covered | Sprint 1 |
| **§3A** | Transfer verification (Session ID / Ref, fake-alert defense, suspense GL) | `rb_split_tenders.verification`, `verified_by`, Account `1090 POS/Transfer Suspense` | ✅ Covered | Sprint 1 |
| **§3A** | POS terminal hardware tagging | `rb_split_tenders.pos_terminal_id` | ✅ Covered | Sprint 1 |
| **§3B** | Blind cash shift balancing | `rb_cash_shifts (opening_float, actual_cash_counted, variance_reason)` | ✅ Covered | Sprint 1 |
| **§3B** | Soiled/damaged note tracking (*Kudin Yage*) | `rb_cash_denominations`, `soil_discount` | ✅ Covered | Sprint 1 |
| **§3B** | Cash vault / intra-day safe drops | `rb_cash_drops` | ✅ Covered in Sprint 0 DDL | Sprint 0 / 1 |
| **§4A** | Bashi distributor rolling credit | `rb_bashi_ledger`, `rb_parties_credit` | ✅ Covered | Sprint 1 |
| **§4A** | Dynamic credit limits + Hard/Soft stop | `credit_limit`, `hard_stop` flag, manager PIN override | ✅ Covered | Sprint 1 |
| **§4A** | Amana-guarantee registry (*Wakili*) | `rb_guarantors`, guarantor-level exposure tracking | ✅ Covered in Sprint 0 DDL | Sprint 0 / 1 |
| **§4B** | Institutional BNPL (Credit ceiling, net terms, delivery slips) | `rb_institutional_terms`, `rb_delivery_notes` | ✅ Covered | Sprint 5 |
| **§4B** | Tiered aging buckets (Retail, Distributor, Institutional, Staff) | Tier-specific aging calculation logic | ✅ Covered | Sprint 1 / 5 |
| **§4B** | Price indexing DSL for flour fluctuations | `rb_institutional_terms.price_index_rule` DSL engine | ✅ Covered | Sprint 5 |
| **§4C** | Staff IOUs & auto-deduction at payroll | `rb_staff_ledger`, `rb_payroll_runs` | ✅ Covered | Sprint 6 |
| **§4C** | Petty cash float & vouchers | `rb_petty_cash_float`, `rb_petty_cash_vouchers` | ✅ Covered | Sprint 6 |
| **§5** | Crate two-way ledger, deposit vs trust, swap enforcement | `rb_crates`, `rb_crate_ledger` | ✅ Covered | Sprint 2 |
| **§6** | Factory rejects (same-day counter discount sale) | `rb_waste_returns.disposition = 'counter_discount'` | ✅ Covered | Sprint 6 |
| **§6** | Market stale returns | `rb_waste_returns` | ✅ Covered | Sprint 6 |
| **§6** | Stale → animal feed salvage sales | `rb_feed_inventory`, Spoilage Loss vs Feed Salvage GL | ✅ Covered | Sprint 6 |
| **§7** | Grid power meter readings (kWh vs tariff) | `rb_energy_logs (source='grid', grid_units_kwh, tariff_per_kwh)` | ✅ Covered | Sprint 4 |
| **§7** | Generator runtime & 250hr service cycle | `rb_generators.service_interval_hours`, cron check | ✅ Covered | Sprint 4 |
| **§7** | Cost Per Loaf (CPL) energy allocation | `rb_energy_allocations` pro-rated to production batches | ✅ Covered | Sprint 4 |
| **§8** | Immutable General Ledger Architecture | `journal_entries`, `journal_lines`, `PostingService` | ✅ Sprint 0 Core | Sprint 0 |
| **§9** | "No-Lies" daily reconciliation sheet | Report logic querying `rb_stock_counts` & `rb_free_samples` | ✅ Sprint 0 DDL, Sprint 7 Report | Sprint 0 / 7 |
| **§9** | Daily Cash Box Settlement | Formula: Opening + Cash Tenders + Debt Recoveries - Drops - Petty - Refunds | ✅ Covered | Sprint 1 / 7 |
| **§9** | Aging Debt Register (*Takardar Masu Bashi*) | Per-tier aging report query | ✅ Covered | Sprint 7 |
| **§9** | Crate Deficit Ledger | Crate exposure query by customer and crate type | ✅ Covered | Sprint 2 / 7 |
| **§10** | Dual language (Hausa / English) | `docs/i18n/ha.json`, i18n translation engine | ✅ Sprint 0 Seed | Sprint 0 / 3 |
| **§10** | Offline-First PWA | Dexie.js IndexedDB outbox + `rb_sync_ledger` idempotency | ✅ Covered | Sprint 3 |
| **§10** | Thermal receipt printing with HMAC QR signature | Receipt print layout with signed URL verification | ✅ Covered | Sprint 3 |
| **§10** | Automated SMS / WhatsApp debt alerts with guarantor CC | `rb_notifications`, Termii / Africa's Talking / WhatsApp Cloud | ✅ Covered | Sprint 5 |
