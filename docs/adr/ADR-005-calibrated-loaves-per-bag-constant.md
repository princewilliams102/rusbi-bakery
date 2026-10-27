# ADR-005: Calibrated Loaves-per-Bag Constant and Yield Shortfall Categorization

## Status
Accepted

## Context
Standard bread yield per 50kg flour bag varies by loaf size (e.g. 800g Jumbo vs 500g Medium), flour hydration, proofing climate, and oven design. Hardcoding an arbitrary constant (e.g. 125 loaves/bag) produces false variance alerts, eroding baker trust.

## Decision
1. **Configurable Constant per Recipe**:
   `rb_recipes.loaves_per_bag` is a configurable parameter calibrated through physical test bakes.
2. **Threshold Alert**:
   Variances exceeding -2% trigger mandatory categorization:
   - `burnt`: Oven thermostat/heat defect.
   - `fallen`: Over-proofing or dough collapse.
   - `slicing_defect`: Packaging/slicing damage.
   - `theft_shortfall`: Unaccounted loss.
3. **GL Expense Classification**:
   Yield shortfalls post to categorized expense accounts (`5400 Yield Loss — Burnt`, `5401 Yield Loss — Fallen`, `5402 Yield Loss — Theft/Shortfall`) rather than getting buried in general cost of goods.

## Consequences
- Accurate theft detection on the "No-Lies" daily reconciliation sheet.
- Bakers trust variance metrics because standards reflect verified physical recipes.
