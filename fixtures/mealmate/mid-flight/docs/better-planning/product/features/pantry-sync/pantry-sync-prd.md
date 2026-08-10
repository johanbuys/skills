# pantry-sync — PRD

**Status:** in-review — 2026-06-02 (draft 2026-06-01 · round 1 comments applied · **one open question: P7 barcode scanning scope**)
**Depends on:** [../../mealmate-prd.md](../../mealmate-prd.md) §Features, §Design principles
**Draws on:** [../../../research/user-interviews-findings.md](../../../research/user-interviews-findings.md)
**Companion:** [pantry-sync-prd-overview.html](pantry-sync-prd-overview.html)

> Other features consume this one's contracts: **shopping-list-gen** reads `PantryItem` and
> subscribes to sync events. Schema changes below are a dependency-surface change — the
> shopping-list-gen PRD is not drafted until this settles.

## Overview

pantry-sync keeps the pantry — the product's source of truth — honest, at a friction cost a
tired human will actually pay. It has two jobs: the one-time **census** (getting the pantry
into the app) and the recurring **sync** (keeping it true after shopping and cooking). The
single most important thing to understand: this feature carries the core bet — if
reconciliation friction is too high here, mealmate has no product.

## User stories

1. As a new user, I want to enter my pantry room-by-room in one sitting, so that setup feels
   like one bounded chore, not an open-ended data-entry job.
2. As a new user, I want smart defaults for units (jar, can, g, ml, count), so that I record
   "2 cans of tomatoes" the way I think it.
3. As a returning shopper, I want to confirm my shopping list into the pantry in one tap per
   item (or one tap for all), so that a shop takes seconds to record.
4. As a cook, I want cooking a planned meal to decrement its ingredients automatically, so
   that the pantry updates as a side effect of living, not as a chore.
5. As a cook who improvised, I want to record an unplanned meal quickly, so that off-plan
   cooking doesn't silently corrupt the counts.
6. As a user who spots a wrong count, I want to correct it in place, so that small drift
   never becomes distrust.
7. As a user, I want to see when each item was last touched, so that I know which counts to
   trust.
8. As a user mid-shop with no signal, I want everything above to work offline, so that the
   supermarket basement doesn't break the loop.
9. As a skeptical user, I want an "audit" view of recent sync events, so that I can see *why*
   a count is what it is and undo a mistaken event.
10. As the shopping-list-gen feature (API consumer), I want a stable PantryItem shape and an
    event stream, so that the list derivation never scrapes UI state.

## Requirements / behavior

- **Census.** Guided first-run flow; add items with name, unit, count. Autocomplete against a
  small built-in ingredient name list (on-device); free-text always allowed.
- **Sync events.** Two first-class events mutate counts: `shop-receipt` (confirming a
  shopping list, or ad-hoc additions) and `meal-cooked` (decrement from a recipe's
  ingredient lines, planned or improvised). Manual adjustments are recorded as corrections,
  not events.
- **Event log.** Last 90 days of events retained, browsable, and undoable (undo emits a
  compensating correction; history is never rewritten).
- **Staleness.** Each item carries `updatedAt`; the UI surfaces "not touched in N weeks" as a
  gentle census-refresh nudge, never a blocking prompt.
- **Offline.** All flows work offline; the store is on-device (product PRD R6). No
  cross-device conflict handling in v1 (single-user, single-device assumption).

## Contracts & schemas

```
PantryItem {
  name:      string   // canonical display name, user's words
  unit:      string   // "g" | "ml" | "count" | "jar" | "can" | free-text
  count:     number   // current stock in `unit`
  updatedAt: string   // ISO — last event or correction that touched this item
}

SyncEvent {
  id:        string
  kind:      "shop-receipt" | "meal-cooked"
  at:        string   // ISO
  lines:     { name: string, unit: string, delta: number }[]  // signed deltas
  undoneBy?: string   // id of the compensating correction, if undone
}
```

Consumers: shopping-list-gen (stock reads + event subscription). Both shapes are versioned
from day one (`v: 1` envelope) so a v2 barcode field, if P7 lands that way, is additive.

## Acceptance criteria

1. A 40-item census can be completed in under 15 minutes by a first-time user (moderated
   test, median).
2. Confirming a 25-line shopping list into the pantry takes ≤ 3 taps total.
3. Cooking a planned recipe decrements exactly its ingredient lines, respecting units.
4. An improvised meal can be recorded in under 30 seconds from home screen.
5. Undoing a sync event restores prior counts exactly and leaves both the event and the
   compensating correction visible in the log.
6. All of the above function with the device in airplane mode.
7. A count corrected manually updates `updatedAt` and appears in the audit view as a
   correction.

## Edge cases

- **Unit mismatch on decrement.** Recipe says 200g, pantry holds "1 jar": v1 does not
  convert; the decrement prompts a one-time mapping ("this jar ≈ 450g?") and remembers it
  per item.
- **Decrement below zero.** Floor at zero, flag the item ("count was off — recount?"), and
  record the discrepancy in the event line; never store negative stock.
- **Cooked a recipe missing from the pantry entirely.** The event records the lines with
  `delta` applied to nothing; the audit view marks them "unmatched" so the census can adopt
  them.
- **Duplicate item names differing by case/whitespace.** Normalized for matching; the user's
  original casing is preserved for display.
- **Undo of an already-undone event.** Idempotent no-op with a visible message; never a
  double compensation.
- **Clock skew.** Events are ordered by insertion, not timestamp; `at` is display-only, so a
  wrong device clock cannot reorder history.

## Deliberately deferred

- **Household sharing / multi-device** — product-level cut (R4); the single-device
  assumption is load-bearing in the event log design and must be revisited *there* when
  sharing arrives.
- **Unit auto-conversion tables** — v1 learns per-item mappings from the user instead of
  shipping a conversion database; cheaper and matches "honest beats precise".
- **Receipt OCR** — same slot as barcode (P7) but strictly heavier; whatever P7 decides, OCR
  stays v2+.

## Decisions

| # | Decision | Made by | Rationale | Status |
|---|---|---|---|---|
| P1 | Census is a guided one-sitting flow, not incremental adoption | draft → review 1 | research: bounded chore beats open-ended; trust requires a complete-enough baseline | settled |
| P2 | Two event kinds only (`shop-receipt`, `meal-cooked`); corrections are not events | draft → review 1 | keeps the audit log meaningful — events are *causes*, corrections are *repairs* | settled |
| P3 | Undo = compensating correction; history never rewritten | draft → review 1 | trust in counts comes from an inspectable, append-only story | settled |
| P4 | Floor-at-zero with a recount flag (no negative stock) | draft → review 1 | negative counts are meaningless to users and poison derived lists | settled |
| P5 | Per-item learned unit mappings instead of a conversion database | draft → review 1 | "honest beats precise"; a global table is a maintenance tarpit | settled |
| P6 | 90-day event retention | draft → review 1 | covers a season of habits; unbounded logs on-device are a storage liability | settled |
| P7 | **Barcode scanning: in-feature accelerator for `shop-receipt`, or defer wholesale to v2?** | — | 3/12 interviewees called it the only way they'd keep counts current; but coverage is worst where waste happens (produce/bulk), and camera+DB dependency cuts against the PWA-lean stack. Product call with architecture consequences — needs the human. | **open — parked with Johan (review round 2)** |
