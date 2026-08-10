# mealmate — PRD

**Status:** settled — 2026-05-30 (draft 2026-05-27 · review round 1 applied 2026-05-29)
**Depends on:** [mealmate-brief.md](mealmate-brief.md) (settled 2026-05-26)
**Draws on:** [../research/user-interviews-findings.md](../research/user-interviews-findings.md)
**Companion:** [mealmate-prd-overview.html](mealmate-prd-overview.html)

> High-level product PRD. It states *what* and *why* at one diagram's depth; every schema,
> contract, and mechanism defers to a named feature PRD. Decisions carried from the brief
> are marked **[brainstorm]**; calls made at this level are in the resolved-decisions table.

## Vision & problem

Plan a week of meals in five minutes, shop once, waste nothing. The product's one idea: make
the **pantry** first-class, and derive everything else from it — the plan draws on what's
home, the shopping list is computed as plan-minus-pantry, and cooking a meal updates the
pantry so next week starts true. Today that reconciliation happens in people's heads and
fails there (11/12 interviewees buy duplicates; planning eats ~40 minutes).

**For whom:** solo and two-person households who cook 4+ nights a week and already *try* to
plan — motivated planners failed by their tools, not people who need to be convinced to plan.

## Design principles

1. **The pantry is the source of truth; lists are derived.** Any feature that asks the user
   to hand-maintain something derivable is wrong. **[brainstorm]**
2. **Friction budget spent at entry, repaid weekly.** Entering 15 recipes and one pantry
   census is acceptable once; anything recurring must be near-zero-touch.
3. **The phone in the kitchen is the device.** Every flow must work one-handed, offline, on a
   mid-range phone. **[brainstorm]**
4. **Honest counts beat precise counts.** A pantry that's roughly right and *trusted* beats
   an exact one nobody updates — sync flows optimize for "good enough, fast".

## The shape of the whole

Local-first PWA; all data on-device in v1 (no accounts, no server). Three features around one
data hub:

```
        ┌─────────────┐        ┌──────────────────┐
        │  recipe box │───────▶│   week-planner    │
        └─────────────┘  plan  └────────┬─────────┘
                                        │ demand
        ┌─────────────┐   stock  ┌──────▼─────────┐
        │   PANTRY    │◀────────▶│ shopping-list- │
        │ (the hub)   │          │      gen       │
        └──────▲──────┘          └────────────────┘
               │ sync events (shop-receipt, meal-cooked)
        ┌──────┴──────┐
        │ pantry-sync │
        └─────────────┘
```

## Features

- **pantry-sync** — keep pantry counts true with minimum friction: manual census, then
  event-driven updates (shopped, cooked). The riskiest feature: if reconciliation friction
  is too high, the core bet fails. → `features/pantry-sync/pantry-sync-prd.md`
- **shopping-list-gen** — compute plan-minus-pantry, aggregated by unit, editable on top.
  Consumes pantry-sync's contracts (PantryItem, sync events). → feature PRD after
  pantry-sync settles.
- **week-planner** — the day × meal grid; assign recipes to plan slots; the demand side of
  the list computation. → feature PRD after shopping-list-gen.

## Scope cuts (deliberate, with why)

- **No native apps** — PWA covers kitchen/shop usage; native is distribution, not product. **[brainstorm]**
- **No recipe import/scraping** — unused per research, legally murky; personal repertoire is
  the model. **[brainstorm]**
- **No household sharing / accounts** — infra weight, split audience; v1 is single-user,
  on-device. **[brainstorm]**
- **No nutrition tracking, no store integrations** — different products; premature
  partnerships.

## Roadmap (risk and proof first)

1. **pantry-sync** — proves the core bet (will people keep counts current if we make it
   cheap?). Everything depends on this being true.
2. **shopping-list-gen** — first visible payoff; depends on pantry-sync contracts.
3. **week-planner** — the convenience layer; lowest risk, so last.

## Feature PRD index

| Feature | PRD | State |
|---|---|---|
| pantry-sync | features/pantry-sync/pantry-sync-prd.md | in-review |
| shopping-list-gen | — | next per roadmap |
| week-planner | — | after shopping-list-gen |

## Resolved decisions

| # | Open item (from) | Resolution | Where |
|---|---|---|---|
| R1 | T1 platform (research) | Mobile-first PWA, no native v1 | brief → decided directions **[brainstorm]** |
| R2 | T2 recipe source (research) | User-entered only in v1 | brief → decided directions **[brainstorm]** |
| R3 | T3 pantry entry (research) | Manual counts v1; barcode question travels to pantry-sync PRD (P7) | brief → decided directions **[brainstorm]** |
| R4 | T4 household sharing (research) | Deferred out of v1 | brief → scope instincts **[brainstorm]** |
| R5 | Feature order | pantry-sync → shopping-list-gen → week-planner, risk-first | this doc → Roadmap (review round 1) |
| R6 | Data locality | All data on-device; no accounts/server in v1 | this doc → The shape (review round 1) |
