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

1. **Contract** — how we'll know the whole thing worked, in plain words: which tests, what gets observed running, what the human will look at. User-facing acceptance criteria as plain sentences. Also record `LOOP_BASE`, the UTC opening time, and a whole-loop budget in hours set by the human before the first dispatch.
2. **Tasks** — a checklist derived from the plan; each task is one plain sentence plus *done when* (observable behaviour) and *check by* (the command, test, or thing to look at). Size tasks to their complexity — a one-file change is one task; don't shred work into ceremony.
3. **Breadcrumbs** — append-only log: each dispatch's UTC time and budget, what it did and ran, fix rounds, parked findings with rulings, and the gotchas iteration N+1 shouldn't rediscover. A breadcrumb is an appended one-line fact, never narrative prose and never a rewrite of earlier lines — the file is read by subagents mid-loop, not by posterity.

Then read the plan once and scan for conflicts — tasks that contradict each other, the contract, or the constitution. Ask the human about all conflicts and the whole-loop budget in one batched question before task 1, not one interrupt per discovery.

**Resuming:** if `progress.txt` already exists on the branch, trust it and `git log` over your own memory. A checked task is done — never re-dispatch it. A task with fix-round lines resumes its loop at the next round.

## The task loop

One task at a time, one implementer at a time — parallel implementers conflict in a shared worktree.

**Dispatch.** Check the whole-loop budget, then append `task <name> dispatched <UTC>; budget <N>h` to Breadcrumbs; a task gets two wall-clock hours unless the human set another budget. Record BASE (`git rev-parse HEAD`) and spawn a fresh implementer sized to the task: cheap and fast for a mechanical one-or-two-file task with a complete spec, standard for multi-file integration, most capable only where design judgment lives. The dispatch contains: the task's own lines from `progress.txt` (sentence, *done when*, *check by*); the contract; paths to the plan, `CONTEXT.md`, and `CONSTITUTION.md`; interfaces from earlier tasks it couldn't discover; and the reply contract — implement, test, commit, append what it did, what it ran, and any gotchas to Breadcrumbs, and return one status: **done / done-with-concerns / needs-context / blocked**. Never paste session history into a dispatch — a fresh agent needs its task, not your story. Before every later dispatch, compare the current UTC time with both deadlines. If either budget has expired without a clean review, dispatch nothing: update `handoff.md` and surface elapsed time, commits, checks, open findings, and the next decision to the human.

**Handle the status.** *done* → review. *done-with-concerns* → read them; correctness or scope concerns are addressed before review, observations are noted. *needs-context* → supply it and re-dispatch. *blocked* → change something — context, model tier, or task size; if the plan itself is wrong, that is the human's call. Never re-run an unchanged dispatch and hope.

**Review gate — every task, no exceptions.** Spawn a fresh reviewer with the `BASE..HEAD` diff handed over as a file (never pasted), the task's *done when* and *check by*, the contract, the constitution, and the later task list. Two verdicts, both required: does the diff actually meet *done when*, and is the work honest — tests that fail without the change, no hollow assertions, nothing beyond the task. An implementer's self-review never substitutes. The reviewer may return at most three blocking findings, ranked by consequence. Enforce that cap when the report arrives: only its three highest-ranked blocker candidates can enter a fix round; every other concern is a parked one-liner. A finding blocks only when *done when* fails, a MUST in the constitution is violated, or a later task would build on the flaw. Prove a blocker with the cheapest reproduction that establishes the fact — prefer an existing or unit test or a one-line command, and drive the deployed system only when the claim depends on deployed integration. Proof never changes classification: after reproduction, apply the same three-part blocking definition. The proof need not become a permanent check. Never tell a reviewer what not to flag — suspected false positives are raised within these definitions and adjudicated in the loop.

**Fix loop, capped at two rounds.** Resume the same implementer with the review's one to three blocking findings verbatim. Before each round, enforce both time budgets. Every round ends with a scoped re-review of just the fix diff and a one-line Breadcrumbs entry. After the second re-review there is no third fixer dispatch: adjudicate each open finding. Park it with a written ruling only if it no longer meets the blocking definition; otherwise stop and surface it to the human. A task that cannot clear in two rounds is mis-cut, and re-cutting it is the human's decision. A finding that conflicts with what the plan mandates is also the human's call. Minor findings never enter the loop: park them in Breadcrumbs for the ship gate.

**Complete.** Check the box, append one line — `done (commits <base>..<head>, review clean)` or `…, N parked` — and move on. Never advance past open blocking findings. Compare cumulative added test lines with added production lines in `LOOP_BASE..HEAD` using the repo's path boundaries. When both changed and tests grew faster, append the counts and surface the trend as a non-blocking signal in the next human update; it never creates another fix round by itself.

## The ship gate

When every box is checked: one fresh reviewer on the most capable model makes one pass over the whole branch diff against the contract and triages the parked, minor, and newly found lines. Every non-blocking finding that still stands becomes its own GitHub issue on the repository, with a plain-words title and concise evidence; never bundle findings. Dispatch no fixer and no re-review from the ship gate. Any residual finding that meets the blocking definition goes to the human. Then the human looks at what the contract promised they would look at; their reaction, not the reviews, is the verdict.

## At ship: the purge is a promotion

Before merge, one pass over `progress.txt` and the plan while they still exist:

- a durable gotcha an agent could *not* rediscover from the repo → one to three lines in `AGENTS.md` (repo root): name the trap and state the rule. Three lines per gotcha is a hard cap even when pruning creates room. Put measurements, discovery history, and other narrative in a matching `docs/traps.md` entry; the compact rule may point to that heading when relevant, but never tells every agent to preload the file. Count `AGENTS.md` before and after promotion and keep it at or below 150 lines by deduplicating and pruning stale guidance first. If it is already over 150 lines or the gotcha still will not fit, do not grow it: preserve the narrative in `docs/traps.md` and surface the needed compaction to the human. Bootstrap on first promotion: if only `CLAUDE.md` exists, move its content into `AGENTS.md` and leave `CLAUDE.md` as a symlink to it; if neither exists, create `AGENTS.md` plus the `CLAUDE.md` symlink; if only `AGENTS.md` exists, add the symlink. Both existing as separate real files means someone diverged them deliberately — flag it and touch neither. Never `CONTEXT.md` — that is a glossary, and it stays pure.
- a term that caused real friction → the owning `CONTEXT.md`, in the shape of `work-discover/CONTEXT-FORMAT.md` (created by its first promotion — never scaffolded empty)
- a decision and its why → `docs/adr/`, in the shape of `work-discover/ADR-FORMAT.md` (context, decision, alternatives considered, consequences; superseded rather than amended)
- everything else dies with the files

Then delete `progress.txt` and `plans/<slug>.md` in the final commit. The PR is the unit of record.

## Guardrail

Not a task-graph manager, and not process for its own sake. `progress.txt` stays one file — no per-task workspaces, no report files, no scripts; statuses are checkboxes plus appended fact lines, no dependency graphs. If the bookkeeping starts outweighing the code, the tasks are sized wrong.

**Bookkeeping never ships alone.** A status flip and its breadcrumb ride the task's own code commit; the handoff line rides the close-out. A per-step journal chain — "loop opened", "dispatch done", "gate passed", "PR open", "merged" as five ledger-only commits — is ceremony, not history: git already timestamps every one of those moments. Budget: at most one ledger-only commit per feature close-out, none per step. (Origin: fathom's Aug 2026 feature branch ran 95 bookkeeping-only commits out of 135, growing a 1,500-line `progress.txt` that outlived the loop it belonged to.)

## Closing contract

Open this work's `## <slug>` section in `handoff.md` (repo root; create the file if needed) **when the loop starts**, and update the entry as tasks complete and at every stopping point: what moved, what's next, and the **verdict** — what was actually observed running, in plain words, or "none". Sessions end without warning; an entry written only "at the end" is an entry that doesn't get written. A session that produced only conversation says so. An update is an appended one-line dated entry (see `work-start`'s line cap), committed with the work it describes — never its own commit per step.
