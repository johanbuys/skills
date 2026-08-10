---
name: work-implement
description: "Run an existing plan — validation contract and task checklist into progress.txt before any code, subagents sized to the task, fresh agents validate and review, purge-and-promote at ship."
disable-model-invocation: true
---

# Work: implement

Run a plan — usually `plans/<slug>.md` from `/work-discover`, or whatever the user hands you. Read `CONTEXT.md` (repo root) and use its vocabulary. Consult `docs/adr/` before contradicting a decision; if reality disagrees with an ADR, say so and decide with the human — never silently override.

If the repo has a `CONSTITUTION.md` (root), it is binding law: the contract, the tasks, and the code must not conflict with a MUST principle. A conflict is a blocking finding — resolved by changing the plan or amending the constitution with the human, never by quietly ignoring it.

## Before any code: progress.txt

Create `progress.txt` at the repo root, **committed on the work branch** — it must survive crashes and worktree switches, and subagents must be able to read it. Three parts:

1. **Contract** — how we'll know it worked, in plain words: which tests, what gets observed running, what the human will look at. User-facing acceptance criteria as plain sentences.
2. **Tasks** — a checklist derived from the plan; each task is one plain sentence plus *done when* (observable behaviour) and *check by* (the command, test, or thing to look at). Size tasks to their complexity — a one-file change is one task; don't shred work into ceremony.
3. **Breadcrumbs** — starts empty, grows as you build.

## The loop

- Spawn subagents sized to task complexity; point them at `progress.txt` and the plan. Use `/tdd` (vendored from mattpocock/skills) where it fits, at agreed seams.
- After each task: check it off and append breadcrumbs — the gotchas and dead ends iteration N+1 shouldn't rediscover.
- **Validation and review are done by fresh agents that didn't write the code**, reading the contract from `progress.txt` — not from the writing session's conversation.

## At ship: the purge is a promotion

Before merge, one pass over `progress.txt` and the plan while they still exist:

- a durable gotcha an agent could *not* rediscover from the repo → `CONTEXT.md` (created by its first promotion — never scaffolded empty)
- a decision and its why → `docs/adr/`
- everything else dies with the files

Then delete `progress.txt` and `plans/<slug>.md` in the final commit. The PR is the unit of record.

## Guardrail

Not a task-graph manager. Tasks live in `progress.txt` for this loop only — no statuses beyond checkboxes, no dependency graphs, no slice numbering.

## Closing contract

Before ending, append one dated entry to this work's `## <slug>` section in `handoff.md` (repo root; create the file or section if new): what moved, what's next, and the **verdict** — what was actually observed running, in plain words, or "none". A session that produced only conversation says so.
