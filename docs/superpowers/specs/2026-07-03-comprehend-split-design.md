# Design note — splitting better-planning-comprehend into sync + comprehend

**Date:** 2026-07-03 · **Status:** implemented in this PR

## The evidence

A full audit of real usage (all Claude Code transcripts, June–July 2026) found comprehend's two
halves performing very differently:

- The **reconciliation half** (drift ledger, living-TDD updates, checkpoints) worked: its output
  directly drove a plan revision pass (stet M6.5) and the tasks that followed.
- The **comprehension-ritual half** (canvas walk, recall-before-reveal, explain-it-back) got zero
  human engagement across both real runs: one walk was served at ~10 PM after hours of PR review
  and never opened; the other was blanket-approved with an empty submit — skipping the recall check
  and all three decisions flagged for a call. The skill was being run to satisfy the
  better-planning-tasks gate ("do it properly"), not to learn.

Meanwhile the same user repeatedly asked, unprompted and outside the skill, for exactly the
comprehension it was supposed to provide — "explain how the code flow works, no doublespeak, give
it to me straight", "so I can feel it" — i.e. **pull-shaped, plain-language, on-demand** catch-up,
with no appetite for scheduled recall ceremony (least of all at the end of a long session).

## The split

- **better-planning-sync** — the boundary step, agent-driven. Reads TDD + plan + diff window,
  classifies every delta itself (routine / intentional / drift / genuine fork), drafts the TDD
  edits and ledger entries, and presents **one digest**: shape moves, the (usually 0–3) genuine
  forks with context + recommendation, and the batched dispositions with defaults. Batch approval
  is the designed path. Bookkeeping never waits on a review sitting — if the human's away, apply
  the unambiguous dispositions, leave the digest with forks marked open. No quiz. Keeps the TDD
  prerequisite (reconciliation genuinely needs an anchor) and satisfies the tasks gate.
- **better-planning-comprehend** — pull-only catch-up. Triggered by the human wanting their system
  back ("catch me up", "explain X so I can feel it"). Shape-first, plain-language, runnable
  grounding; canvas diagram when available but never required. **No prerequisites** (TDD used when
  present, code read when not — never a forced TDD-reconstruction detour), **no bookkeeping**, no
  recall unless invited ("quiz me"); deep tangents park to study. Explicitly not a gate: no skill
  sends the human here as a precondition.

## Cross-cutting changes

- The boundary loop everywhere (tasks gate, plan revision pass, build step 8) now names **sync**.
- "Lost the thread" routing everywhere now names **comprehend**.
- The README status-index row is `sync`; older planning spaces' `comprehend` rows are treated as
  the same row.
- Study's contributors: both sync and comprehend park topics.
- comprehend's bundle slimmed (doc-layout + drift-ledger template moved out with sync; it keeps
  html-artifacts for ephemeral visuals only).

## The principle this encodes

At a milestone boundary the human's scarce resource is judgment on genuine forks — not
diff-reading, bookkeeping, or proving attention. Agent does everything reconcilable alone; human
decides only what only they can. Comprehension is delivered when pulled, in the shape it's asked
for, not scheduled as ceremony.
