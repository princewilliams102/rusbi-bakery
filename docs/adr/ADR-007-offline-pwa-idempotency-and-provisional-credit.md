# ADR-007: Offline PWA Architecture, Idempotency Keying, and Provisional Credit Approvals

## Status
Accepted

## Context
Commercial bakeries in Northern Nigeria face frequent cellular and broadband drops. Native desktop binaries (Electron) impose high maintenance overhead on multiple Android/tablet terminals across sales counters, dispatch docks, and delivery vans.

## Decision
1. **Progressive Web App (PWA)**:
   Deliver via PWA with Service Worker caching and Dexie.js (IndexedDB) outbox.
2. **Idempotency Spine**:
   Every offline transaction generates a client UUIDv4 and payload SHA-256 hash stored in `rb_sync_ledger` to prevent replay double-postings upon reconnection.
3. **Additive Ledger Events**:
   Offline payment events are strictly additive (inserting ledger lines rather than modifying balances) to avoid concurrency merge conflicts.
4. **Provisional Credit Acceptance**:
   If an offline sale breaches a customer's credit ceiling, it is accepted provisionally (`status = 'provisional'`) and queued for 24-hour manager review rather than turning away a physical customer at the loading dock.

## Consequences
- 100% operational continuity during network blackouts.
- Zero risk of duplicate journal entries when offline queues sync.
