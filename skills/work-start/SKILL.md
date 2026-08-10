---
name: work-start
description: "Orient a session — read CONTEXT.md and handoff.md, find where inflight work stands, and name the one next move."
disable-model-invocation: true
---

# Work: start

Orient this session. Read the repo's memory, find where work stands, name **one** next move.

## Read, in order

1. `CONTEXT.md` (repo root) — the project's shared language and non-discoverable truths. Use its vocabulary for the rest of the session.
2. `handoff.md` (repo root) — where each inflight piece of work stands: one `## <slug>` section per piece, dated entries of *what moved · what's next · verdict*.
3. `progress.txt` — only if it exists on the current branch. Its presence means an implementation loop is mid-flight; it holds that loop's validation contract, task checklist, and breadcrumbs.

A missing file is information, not an error — the repo just hasn't adopted that part of the memory model yet. Say so and carry on.

## Name one move

State the single next move in plain words, with one sentence of reasoning. Not a menu, not a status report.

Bias: **resume inflight work before starting new work.** A mid-flight loop (`progress.txt` with unchecked tasks) beats an inflight handoff section; an inflight handoff section beats a new idea.

If nothing is inflight, ask what the user wants to work on. Something fuzzy → suggest `/work-discover`. A plan already in `plans/` → suggest `/work-implement`.

## Guardrail

This is orientation, not reporting. Don't summarize everything you read, generate a dashboard, or build a routing table. Read, then say the one move.

## Closing contract

When the session's work wraps — not right after orienting — append one dated entry to the work's `## <slug>` section in `handoff.md`: what moved, what's next, and the **verdict** — what was actually observed running, in plain words, or "none". A session that produced only conversation says so. Skip only if `/work-discover` or `/work-implement` already wrote this session's entry.
