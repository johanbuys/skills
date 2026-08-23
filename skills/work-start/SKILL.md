---
name: work-start
description: "Orient a session — read CONTEXT.md and handoff.md, find where inflight work stands, and name the one next move."
disable-model-invocation: true
---

# Work: start

Orient this session. Read the repo's memory, find where work stands, name **one** next move.

## Read, in order

1. `CONTEXT.md` (repo root) — the project's shared language. Use its vocabulary for the rest of the session. If `CONTEXT-MAP.md` exists instead, the repo has multiple contexts — read the map, then the `CONTEXT.md` of whichever context the inflight work touches.
2. `handoff.md` (repo root) — where each inflight piece of work stands: one `## <slug>` section per piece, dated entries of *what moved · what's next · verdict*.
3. `progress.txt` — only if it exists on the current branch. Its presence means an implementation loop is mid-flight; it holds that loop's validation contract, task checklist, and breadcrumbs.

A missing file is information, not an error — the memory files are created lazily by the skills that first write them (`handoff.md` by a closing contract, `CONTEXT.md` by a promotion or an earned glossary entry), never as a setup step. Say which are missing and carry on.

## Name one move

State the single next move in plain words, with one sentence of reasoning. Not a menu, not a status report.

Bias: **resume inflight work before starting new work.** A mid-flight loop (`progress.txt` with unchecked tasks) beats an inflight handoff section; an inflight handoff section beats a new idea.

If nothing is inflight, ask what the user wants to work on. Something fuzzy → suggest `/work-discover`. A plan already in `plans/` → suggest `/work-implement`.

## Guardrail

This is orientation, not reporting. Don't summarize everything you read, generate a dashboard, or build a routing table. Read, then say the one move.

## Closing contract

If the session does real work outside a sibling skill, open or update the work's `## <slug>` section in `handoff.md` as the work moves — not at "the end", which sessions never announce: what moved, what's next, and the **verdict** — what was actually observed running, in plain words, or "none". A session that produced only conversation says so. Skip only if `/work-discover` or `/work-implement` is keeping this session's entry.

**A line is a line.** A dated entry is one line, roughly thirty words. A field that wants a second sentence is pointing at detail that already lives somewhere addressable — the PR body, the commit message, the plan; name the artifact instead of reproducing it. Prior entries are never rewritten, amplified, or summarized: updating a section means appending its next line.

**`handoff.md` and a live loop's `progress.txt` are the only ledgers.** A parallel narrative journal — session notes rewritten as prose each pass, a status file no skill reads — is drift surface competing with the memory files that are load-bearing. Where a repo has grown one, stop appending to it; its history stays in git.
