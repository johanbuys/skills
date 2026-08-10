# Planning — mealmate

This is the better-planning workspace: the map, the conventions, and the **status index**
below. Every family skill (brainstorm → prd → design → plan → tasks) reads this index on open
to know whether to proceed or hand off to a sibling. Update the index in the same commit as
any status change.

## Layout

```
docs/better-planning/
  README.md                         ← this file (the map + status index)
  GLOSSARY.md                       ← living vocabulary
  research/
    user-interviews-findings.md     ← 12 interviews; the evidence behind the brief
  product/
    mealmate-brief.md               ← phase ① alignment record (settled)
    mealmate-prd.md                 ← high-level product PRD (settled)
    mealmate-prd-overview.html      ← its visual companion
    features/
      pantry-sync/                  ← all of a feature's artifacts together
        pantry-sync-prd.md
        pantry-sync-prd-overview.html
```

## Status index

| Artifact | Phase | Status |
|---|---|---|
| research/user-interviews-findings.md | research | done 2026-05-20 |
| product/mealmate-brief.md | brainstorm | settled 2026-05-26 |
| product/mealmate-prd.md | prd | settled 2026-05-30 |
| product/features/pantry-sync/pantry-sync-prd.md | prd | in-review 2026-06-02 — 1 open question (barcode scanning scope) |

## Where things stand

Brainstorm and the high-level PRD are **settled**: mobile-first PWA (no native apps),
user-entered recipes only in v1, manual pantry entry — all traced in the PRD's
resolved-decisions table. Do not re-open these without new evidence.

The first feature PRD, **pantry-sync**, is **in-review**: round 1 comments were applied
2026-06-02; one question is still open — barcode scanning scope (in-feature accelerator vs
defer to v2), decision P7 in its decisions table. It's the only thing between the doc and
settled.

**Next per the roadmap** (risk-first, PRD §Roadmap): settle pantry-sync, then draft the
**shopping-list-gen** feature PRD (it consumes pantry-sync's contracts, so order matters),
then week-planner.
