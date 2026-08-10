# taskpilot (eval fixtures)

Fixture worlds for the better-planning family evals: a small task-manager CLI at three
**progressive snapshots of the family flow** — each later snapshot is a consistent evolution
of the earlier one (same app code, same untouched legacy doc, more planning artifacts):

1. `legacy-docs/` — the app + legacy `docs/plans/old-roadmap.md`, **no** `docs/better-planning/`
   yet. World for prd eval 0 (`draft-feature-prd-artifacts`) — the skill must create the
   space without clobbering the legacy doc.
2. `prd-settled/` — layers on a settled `recurring-tasks` feature PRD (+ companion, README
   index, GLOSSARY). World for design eval 0 (`tdd-from-settled-prd-walked-not-dumped`).
3. `prd-in-review/` — layers on an **in-review** `notifications` feature PRD with three open
   fork-level decisions (N1–N3). World for design eval 1 (`routes-back-when-prd-not-settled`).

Tier-3 snapshots (built code + git history, for the comprehend evals) extend this same
timeline in a follow-up: prd-settled → tdd+plan → built-m2-divergent.

This parent README is not part of any fixture — `prepare` copies only the snapshot
directories, so the worlds stay free of eval-harness markers. Not a real project.
