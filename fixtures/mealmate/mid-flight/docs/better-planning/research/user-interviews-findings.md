# User interviews — findings

**Status:** done — 2026-05-20
**Scope of confidence:** validates the *problem* (planning friction, waste, list/pantry
mismatch) for solo and two-person households who cook 4+ nights a week. It does NOT validate
any solution shape, pricing, or families-with-kids workflows (only 2 of 12 interviews).

## Method

12 semi-structured interviews (45 min), recruited from two local cooking forums and one
budgeting subreddit. 7 solo households, 3 couples, 2 families. All already attempt weekly
meal planning in some form (selection bias: these are motivated planners).

## Top pains, ranked by frequency

1. **The shopping list never matches what's already home** (11/12). People buy duplicates
   ("third jar of cumin") or come home missing one ingredient. The list is written from the
   plan, not from plan-minus-pantry.
2. **Weekly planning takes too long** (9/12). Median self-reported ~40 minutes; the time sink
   is deciding, then re-deriving the list by hand.
3. **Waste guilt** (8/12). Produce bought for a plan that changed mid-week.
4. **Recipe apps feel like someone else's kitchen** (7/12). Imported recipe collections go
   unused; people cook a personal repertoire of ~10–20 dishes.

## Observations that shaped scope

- Every participant already keeps *some* pantry knowledge in their head; none maintain it in
  an app. Friction of entry is the stated reason (6/12, unprompted).
- Phone is the device in the kitchen and the shop (12/12). Two participants mentioned a
  laptop, both for the *planning* step only.
- Barcode scanning came up unprompted in 3/12 interviews as "the only way I'd keep counts
  current"; 2 others, when probed, said produce and bulk goods (most of their waste) have no
  barcode anyway.

## Open tensions handed to the PRD

Each item below must appear in a downstream decisions table as resolved or deliberately
deferred:

- **T1** — v1 platform: phone-first is clear; native app vs PWA is not a research call.
- **T2** — recipe source: personal repertoire (entry friction) vs imported database (unused).
- **T3** — pantry entry: manual counts (friction, universal) vs barcode (current, partial
  coverage).
- **T4** — household sharing: couples want a shared list; solo users don't care. v1 call
  needed.
