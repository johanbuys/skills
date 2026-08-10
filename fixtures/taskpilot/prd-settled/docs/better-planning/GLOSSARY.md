# GLOSSARY — taskpilot planning

Living vocabulary for the better-planning family. Every term used with a precise meaning gets
an entry: **definition**, **not to be confused with**, and **where it's specced**. Update in
the same commit as any change that introduces, renames, or sharpens a term.

---

**Template task** — a task that carries a schedule (`rrule` + `dtstart`) and produces
occurrences. It never appears in `tp list` itself; only its occurrences do.
· *Not* an occurrence, and *not* a category/tag — it's a generator.
· Specced: recurring-tasks-prd.md → Contracts & schemas.

**Occurrence** — a real, listable task materialized from a template for one scheduled date.
Has its own id, can be completed or skipped independently.
· *Not* a virtual/computed row — once generated it is a first-class task in the store.
· Specced: recurring-tasks-prd.md → Contracts & schemas, Decision D4.

**Schedule (RRULE)** — the recurrence rule stored on a template task as an RFC 5545 RRULE
string (e.g. `FREQ=WEEKLY;BYDAY=TU`), anchored by `dtstart`.
· *Not* a cron expression and *not* plain english; RRULE is the storage format (user call D1).
· Specced: recurring-tasks-prd.md → Decisions D1.

**Lookahead window** — how far ahead of "now" occurrences are materialized when the app runs.
Capped at 1 year (user call D3); within the cap, generation fills up to the window edge.
· *Not* a retention policy for past occurrences.
· Specced: recurring-tasks-prd.md → Requirements, Decision D3.

**Skip** — marking one occurrence as deliberately not done. The series is unaffected; skipped
occurrences stay in the store for history.
· *Not* delete, and *not* pause — skip is per-occurrence.
· Specced: recurring-tasks-prd.md → Requirements, Decision D5.

**Pause** — suspending a template so no new occurrences are generated while paused. Resuming
does not backfill the occurrences that would have fallen in the paused span.
· *Not* skip (per-occurrence) and *not* delete — the template and its history survive.
· Specced: recurring-tasks-prd.md → Requirements, Decision D6.
