---
name: work-implement
description: "Run an existing plan as a subagent-driven loop — the controller never writes code: fresh implementers per task, a review gate after every task, a capped fix loop, progress.txt as the crash-proof ledger, purge-and-promote at ship."
disable-model-invocation: true
---

# Work: implement

Run a plan — usually `plans/<slug>.md` from `/work-discover`, or whatever the user hands you. Read `CONTEXT.md` (repo root) and use its vocabulary. Consult `docs/adr/` before contradicting a decision; if reality disagrees with an ADR, say so and decide with the human — never silently override.

If the repo has a `CONSTITUTION.md` (root), it is binding law: the contract, the tasks, and the code must not conflict with a MUST principle. A conflict is a blocking finding — resolved by changing the plan or amending the constitution with the human, never by quietly ignoring it.

**You are the controller. You never write code.** Your context stays clean for coordination, and a controller fix would skip review. Implementers and reviewers are subagents — and a task's reviewer is never the agent that wrote it.

## Before any code: progress.txt

On a work branch — never main — create `progress.txt` at the repo root, **committed and pushed with the work**. It is the loop's ledger: it must survive crashes, compaction, and worktree switches, and subagents read it. Three parts:

1. **Contract** — how we'll know the whole thing worked, in plain words: which tests, what gets observed running, what the human will look at. User-facing acceptance criteria as plain sentences.
2. **Tasks** — a checklist derived from the plan; each task is one plain sentence plus *done when* (observable behaviour) and *check by* (the command, test, or thing to look at). Size tasks to their complexity — a one-file change is one task; don't shred work into ceremony.
3. **Breadcrumbs** — append-only log: what each dispatch did and ran, fix rounds, parked findings with rulings, and the gotchas iteration N+1 shouldn't rediscover.

Then read the plan once and scan for conflicts — tasks that contradict each other, the contract, or the constitution. Ask the human about all of it in one batched question before task 1, not one interrupt per discovery.

**Resuming:** if `progress.txt` already exists on the branch, trust it and `git log` over your own memory. A checked task is done — never re-dispatch it. A task with fix-round lines resumes its loop at the next round.

## The task loop

One task at a time, one implementer at a time — parallel implementers conflict in a shared worktree.

**Dispatch.** Record BASE (`git rev-parse HEAD`). Spawn a fresh implementer sized to the task: cheap and fast for a mechanical one-or-two-file task with a complete spec, standard for multi-file integration, most capable only where design judgment lives. The dispatch contains: the task's own lines from `progress.txt` (sentence, *done when*, *check by*); the contract; paths to the plan, `CONTEXT.md`, and `CONSTITUTION.md`; interfaces from earlier tasks it couldn't discover; and the reply contract — implement, test, commit, append what it did, what it ran, and any gotchas to Breadcrumbs, and return one status: **done / done-with-concerns / needs-context / blocked**. Never paste session history into a dispatch — a fresh agent needs its task, not your story. Have implementers use `/tdd` (from mattpocock/skills) at the seams the plan agreed; when it isn't installed, carry its essence in the dispatch — red before green, one slice at a time, tests only at agreed public seams, never against internals.

**Handle the status.** *done* → review. *done-with-concerns* → read them; correctness or scope concerns are addressed before review, observations are noted. *needs-context* → supply it and re-dispatch. *blocked* → change something — context, model tier, or task size; if the plan itself is wrong, that is the human's call. Never re-run an unchanged dispatch and hope.

**Review gate — every task, no exceptions.** Spawn a fresh reviewer with the `BASE..HEAD` diff handed over as a file (never pasted), the task's *done when* and *check by*, the contract, and the constitution. Two verdicts, both required: does the diff actually meet *done when*, and is the work honest — tests that fail without the change, no hollow assertions, nothing beyond the task. An implementer's self-review never substitutes. Never tell a reviewer what not to flag — if you think a finding will be a false positive, let it be raised and adjudicate it in the loop.

**Fix loop, capped at five rounds.** Blocking findings — contract, *done when*, constitution, or anything important — go back. Rounds 1–3 resume the same implementer with the findings verbatim; it knows the code and its own choices. Rounds 4–5 dispatch a fresh implementer one model tier up, pointed at Breadcrumbs for what was already tried — a loop that survives three resumes means the implementer can't see its own problem. Every round ends with a scoped re-review of just the fix diff, and a one-line Breadcrumbs entry. At the cap, adjudicate each open finding yourself: park it with a written ruling in Breadcrumbs, or — if a later task would build on the flaw — stop and surface it to the human. No silent discards, ever. A finding that conflicts with what the plan's own text mandates is also the human's call, not yours. Minor findings never enter the loop: park them in Breadcrumbs for the ship gate.

**Complete.** Check the box, append one line — `done (commits <base>..<head>, review clean)` or `…, N parked` — and move on. Never advance past open blocking findings.

## The ship gate

When every box is checked: one fresh reviewer on the most capable model reads the whole branch diff against the contract and triages the parked and minor lines — which must be fixed before merge, which stand. If it finds problems, dispatch **one** fixer with the complete list (never one per finding), then one scoped re-review. There is no second wave — residual load-bearing findings go to the human. Then the human looks at what the contract promised they would look at; their reaction, not the reviews, is the verdict.

## At ship: the purge is a promotion

Before merge, one pass over `progress.txt` and the plan while they still exist:

- a durable gotcha an agent could *not* rediscover from the repo → `CONTEXT.md` (created by its first promotion — never scaffolded empty)
- a decision and its why → `docs/adr/`
- everything else dies with the files

Then delete `progress.txt` and `plans/<slug>.md` in the final commit. The PR is the unit of record.

## Guardrail

Not a task-graph manager, and not process for its own sake. `progress.txt` stays one file — no per-task workspaces, no report files, no scripts; statuses are checkboxes plus appended fact lines, no dependency graphs. If the bookkeeping starts outweighing the code, the tasks are sized wrong.

## Closing contract

Open this work's `## <slug>` section in `handoff.md` (repo root; create the file if needed) **when the loop starts**, and update the entry as tasks complete and at every stopping point: what moved, what's next, and the **verdict** — what was actually observed running, in plain words, or "none". Sessions end without warning; an entry written only "at the end" is an entry that doesn't get written. A session that produced only conversation says so.
