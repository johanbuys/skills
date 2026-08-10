# Planning — taskpilot

This is the better-planning workspace: the map, the conventions, and the **status index**
below. Every family skill (brainstorm → prd → design → plan → tasks) reads this index on open
to know whether to proceed or hand off to a sibling. Update the index in the same commit as
any status change.

## Layout

```
docs/better-planning/
  README.md                         ← this file (the map + status index)
  GLOSSARY.md                       ← living vocabulary
  product/
    features/
      recurring-tasks/              ← all of the feature's artifacts together
        recurring-tasks-prd.md
        recurring-tasks-prd-overview.html
```

Legacy planning notes predate this space and stay where they are, untouched:
`docs/plans/old-roadmap.md` is kept as orientation/history, not migrated.

## Status index

| Artifact | Phase | Status |
|---|---|---|
| product/features/recurring-tasks/recurring-tasks-prd.md | prd | settled 2026-06-20 |

## Where things stand

Recurring tasks entered the family at the PRD phase — **briefless entry**: the user arrived
with the fork-level calls already made (RRULE storage on the task, lazy on-run generation,
1-year lookahead cap), so no brainstorm brief exists; those calls are recorded as user-made
in the PRD's decisions table. The draft went through one review round (2026-06-19) and
**settled 2026-06-20**. Reminders/notifications were deliberately deferred out of this
feature (see the PRD's deferred section).

**Next:** the technical design (better-planning-design) — occurrence generation, store shape,
and the RRULE library choice are undecided *how*s the PRD deliberately left open.
