---
name: better-planning-sync
description: "The better-planning family's milestone-boundary reconciliation — when a slice of agent-built work lands, it keeps the planning space true to the code *itself*: reads the diff since the last checkpoint, classifies every architectural delta, drafts the living-TDD updates for intentional evolution, logs real drift to <feature>-drift.md with a proposed fix, curates the glossary, and records the checkpoint — then hands the human a one-screen digest where only genuine forks ask for a decision and everything else is batch-approved with one word. Use it whenever a plan milestone or PR lands (\"M2 just merged\", \"run the sync\", \"reconcile what landed against the design\", \"did the build drift from the TDD?\"), and before better-planning-tasks breaks down the next milestone — this skill is what satisfies that gate."
---

# Better Planning · Sync (milestone-boundary reconciliation)

Agents make architectural calls the human never sees, and the design of record rots unless someone
reconciles the landed code against it. That someone should be the agent. The human's scarce resource
at a boundary is **judgment on genuine forks** — not diff-reading, not ledger bookkeeping, and not
proving they were paying attention. This skill's predecessor made the human walk every delta and sit
a recall quiz at each boundary; in practice the walk got skipped or blanket-approved at the end of a
long day, while the bookkeeping underneath was what actually fed the next milestone. Sync keeps the
bookkeeping and inverts the ceremony: **do everything reconcilable alone, ask only what only the
human can answer.**

It's a companion, not a step on the ladder — it runs *during* the build, at the boundaries.

| Phase | Skill | Output |
|---|---|---|
| ① brainstorm | better-planning-brainstorm | `<x>-brief.md` |
| ② prd | better-planning-prd | `<x>-prd.md` |
| ③ design | better-planning-design | `<feature>-tdd.md` — the design of record this skill defends |
| ④ plan | better-planning-plan | `<feature>-plan.md` — its milestones are this skill's trigger points |
| ⑤ tasks | better-planning-tasks | `<feature>-tasks.md` |

⊕ **better-planning-sync** (this one) runs when tasks land. It needs a TDD — with no design of
record there's nothing to reconcile against, which is exactly why drift is invisible in projects
that never wrote one. No TDD? Offer **better-planning-design** to create the anchor first; for a
feature already mid-build without one, offer to reconstruct a TDD from the code as the baseline,
then sync forward from there. (If what the human actually wants is to *understand* the system, not
reconcile it, that's **better-planning-comprehend** — no anchor required there.)

## When it runs

- **At each milestone boundary** — a milestone's PR merges; before better-planning-tasks breaks
  down the next milestone. Sync satisfies the reconciliation half of that gate; the plan's revision
  pass is the other half (same boundary, two directions: sync looks back at the code, the revision
  pass looks forward at the arc).
- **On demand** — "did the build drift?", "reconcile what the loop landed", after reviewing a batch
  of agent-built PRs.

It reads three things: the **TDD** (the anchor), the **plan's milestones** (the checkpoint), and
the **diff since the last sync** (the window recorded in the drift ledger).

## The pass — the agent reconciles first

Work the whole window before involving the human. From the diff, classify every change:

- **Routine** — within-spec implementation churn. Summarize the lot in a line or two; never walk
  it. Surfacing everything is the same as surfacing nothing.
- **Intentional evolution** — an architectural move that's consistent with the TDD's intent but not
  its letter (a concept grew a responsibility, an interface gained a variant). Draft the living-TDD
  update and the rationale line now; it ships with the digest as a proposed edit.
- **Drift** — code diverged from a decision the human made, with no justification. Draft the ledger
  entry and a concrete proposed fix. Never write the fix itself — a fix is a flagged item the
  builder or a task picks up under the plan's reality-disagrees protocol.
- **Genuine fork** — a call the TDD never covered, or a drift item where accept-vs-fix is genuinely
  arguable. These are the human's. Everything else gets a proposed disposition and a default.

Also flag **complexity growth** plainly — a new concept, or one that ballooned past its original
job. That's the "did my simple idea get complex?" check, and it's often the digest's most
valuable line.

## The digest — one screen, forks first

Present the whole boundary as **one digest**, not a walk:

1. **What landed** — the milestone, in a sentence.
2. **What moved on the shape** — the handful of concepts and connections that changed, framed as
   moves on the map ("the coordinator grew a responsibility", "a new concept appeared between X and
   Y"). If **canvas** is installed, draw it as a diagram-kit diagram with moved nodes marked
   (`highlight` moved, `emphasis` ballooned, `new` appeared, `alert` drift — mapping in
   `references/html-artifacts.md`); a tight text sketch is a first-class fallback, not a failure.
3. **The genuine forks — usually zero to three** — each presented the way a real decision deserves:
   plain language, the context, the options with consequences, a recommendation. These need an
   explicit answer.
4. **The batch** — every proposed disposition (TDD updates, drift entries, fixes to flag), listed
   with its default. One word ("apply", "lgtm", an empty canvas submit) accepts the lot; the human
   pulls out any item they want to argue. Batch approval is the *designed* path, not a bypass —
   the forks are where their judgment goes.

**Never hold the bookkeeping hostage to a sitting.** If the human isn't around or the session is
ending, apply the unambiguous dispositions, record the checkpoint, and leave the digest — forks
clearly marked as *open* — in the feature directory and the session summary. The next session (or
better-planning-tasks, when it hits the gate) picks the forks up. A boundary that waits days for a
review ritual is how ledgers go stale.

No recall quiz, no read-back. If the human wants to be *taught* what changed rather than shown the
digest — "catch me up properly", "I've been away" — that's **better-planning-comprehend**; offer it,
don't emulate it.

## Bookkeeping — what a sync leaves behind

Once dispositions are settled (or defaulted):

- **Living TDD** updated in place — intentional evolution folded in, rationale appended to its
  decisions table; a fork's answer recorded as a new decision.
- **Drift ledger** (`<feature>-drift.md`, format in `assets/drift-ledger-template.md`, conventions
  in `references/doc-layout.md`) — one entry per consequential delta with its disposition, the
  checkpoint row ("M2 synced — <date>", diff window), and the open-fixes list updated.
- **Glossary** — read `GLOSSARY.md` and use its terms in the digest; a term the build coined gets
  flagged in the batch ("new term `X` — add, rename, or map?") and appended if accepted.
- **README status index** — update the `sync` row (older planning spaces may label it
  `comprehend`; treat it as the same row).
- **Commit the TDD edits and the ledger together** — one commit, so the design of record and its
  reconciliation history move in lockstep.

### Parking what the human doesn't grok

A delta sometimes exposes something worth understanding properly but not now. Offer to park it:
append one line to `~/.study/topics.md` (the **study** skill's queue) with the topic and the repo +
file context, so the eventual deep dive is grounded in real code. If study isn't installed, note the
gap in the drift ledger instead. Never stop to teach mid-sync.

## What this skill is not

- Not a comprehension lesson: it reconciles the record; it doesn't rebuild the human's mental
  model. "Explain it to me", "catch me up", "how does X work now" → **better-planning-comprehend**.
- Not a code reviewer: it judges *whether the shape stayed true to the TDD*, not code quality,
  style, or bugs — those belong to review tooling.
- Not the fixer: it flags drift with a proposed fix; it never writes the fix. Auto-fixing would
  re-create the invisible-decision erosion it exists to stop.
- Not a quiz: proving the human was paying attention is not an output. The record staying true and
  the forks getting real judgment are.
