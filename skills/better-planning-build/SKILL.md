---
name: better-planning-build
description: "better-planning-build — the family's build-time execution companion (pairs with sync at the boundary). Run a slice of planned work as a small three-role mob — the human is the Architect who holds intent and makes the calls, the main session is the Lead who turns intent into tight tasks, dispatches Driver subagents test-first, runs Skeptics to verify, and surfaces only genuine forks at the altitude of the idea. The structural/routine line is the master dial — the Architect owns the structural work hands-on, the agent owns the routine work, and any routine task that turns out to be structural stops and escalates. Use this whenever executing planned work with the human staying in control instead of rubber-stamping an unattended loop — \"let's build this slice\", \"drive this task\", \"review and fix this loop PR\", \"execute this milestone with me in the loop\", \"pair on this build\", \"I want to stay the architect while we build\"."
---

# Better Planning · Build (build-time execution companion)

Authorship erosion is the other quiet failure of agentic coding. `sync` defends the design of
record as code lands; this skill defends the human's *authorship* as code is **written**. Handed
to an unattended loop, execution grinds tasks and lands large green PRs — and a simple idea becomes
a complex artifact the human never shaped, decision by invisible decision. It is worst on
greenfield, where the system is complex before the human ever runs it. This skill is the
counter-loop: it runs a slice of planned work as a small mob with the human as the **Architect**
making the calls that matter, agents doing the typing, and complexity fought in real time — so the
human stays the creator, not the rubber stamp.

The family's **second build-time companion**, beside `sync`. They pair: this skill *executes*
a slice; sync *reconciles* it at the milestone boundary. (`comprehend` is the third leg — the
on-demand catch-up for a human who's lost the thread.)

| Phase | Skill | Output |
|---|---|---|
| ① brainstorm | better-planning-brainstorm | `<x>-brief.md` |
| ② prd | better-planning-prd | `<x>-prd.md` |
| ③ design | better-planning-design | `<feature>-tdd.md` |
| ④ plan | better-planning-plan | `<feature>-plan.md` |
| ⑤ tasks | better-planning-tasks | `<feature>-tasks.md` |
| ⊕ sync | reconcile landed code vs the TDD at a boundary | `<feature>-drift.md` |
| ⊕ **build** (this) | execute a slice with the human as Architect | verified, owned code |

## When it runs

Whenever planned work is being *executed* and the human wants to stay in control rather than review
a finished pile — "let's build this slice", "drive this task", "execute this milestone with me in
the loop", "pair on this". Also when **reviewing or fixing loop-produced code** — "review this PR
the paired way", "the loop landed this, is it right" — where it opens with a Skeptic pass.

It needs something to build against — a task, a slice, a PR, or a clear intent. No plan yet? Offer
`better-planning-plan` / `-tasks` first. Lost the thread of what already landed? That is
`comprehend` (on-demand catch-up, no prerequisites).

## The roles

- **Architect** (the human). Holds the intent. Makes the calls on genuine forks. Can take the wheel
  any time. Everything below exists to keep them the creator.
- **Lead** (you, the main session). Turn the Architect's intent into tight, scoped Driver tasks.
  Dispatch. **Protect the idea — fight complexity:** an agent's instinct is to add; yours is to ask
  "does this stay the idea, or grow past it?" Surface decisions to the Architect at the altitude of
  the idea, never the diff. Verify the Driver's work yourself.
- **Driver** (subagent). Stateless hands. One bounded task, test-first, returns a small diff.
- **Skeptic** (subagent). Independent verifier. Refute a Driver diff or a review finding *before* it
  reaches the Architect. You never mark your own homework.
- **Scout** (subagent). Parallel research — how existing code works, what to reuse — so the Driver
  reuses instead of reinventing.

## The master dial — structural vs routine

Classify every piece of work. This one line governs everything else.

- **Structural work** — core types, interfaces, the walking skeleton, contracts, anything other
  code depends on. The Architect owns it, hands-on.
- **Routine work** — bounded work inside an already-decided shape. The agent owns it.

| | Structural | Routine |
|---|---|---|
| Who decides | Architect | Lead (mechanism + small defaults) |
| Brief cadence | approve-first | show-and-run (interruptible) |
| Automation | low — watch each move | high — run several, check in at the boundary |

**A routine task that turns out to be structural stops and escalates.** "Automation = leash length"
is just how many routine steps you run between check-ins.

On greenfield especially: build the thin structure first and *run it* before handing routine work to
the loop. A running skeleton the Architect has touched is owned; a finished pile is not.

## The loop (one slice)

1. **Classify: structural or routine.**
2. **Skeptic pass** (when reviewing existing / loop-produced code): fan out independent finders;
   verify the load-bearing finding *yourself*; dedupe to the few that matter.
3. **Report to the Architect** in the fixed shape (below).
4. **Driver brief** per call the Architect makes — test-first, scoped, with a stop-and-report clause
   for anything beyond scope.
5. **Driver runs**, returns a small diff.
6. **Verify the diff yourself** — read it, run the suite. Never the Driver's word. Surface any
   deviation it reports.
7. **Commit / merge** with a plain-language review-trail comment, and only on the Architect's
   explicit go for irreversible steps.
8. **Offer `sync`.** When the slice or milestone lands, offer to run `sync` to reconcile what
   landed against the design of record — build did the work, sync keeps the record true and brings
   only genuine forks back to the Architect. This is the family handoff that closes the loop.
9. **Leave the trail** (below) — before the slice or the session ends, whichever comes first.

## The handoff trail — every slice ends resumable

Sessions die, contexts compact, and the next cycle is often a different session (or a different
agent) — the questions "what did the previous run teach us?" and "does a cold start have enough
to begin the next task?" should never need asking, because the answer is already on disk. At the
end of every slice — and *immediately* if the session looks like it's ending mid-slice — write or
update **`<feature>-handoff.md`** next to the feature's other artifacts (or a `HANDOFF.md` at the
repo root when there's no planning space):

- **Where the build stands** — tasks done / in-flight / remaining, branch and PR state, what's
  verified vs. merely written.
- **Learnings that change the next slice** — gotchas hit, Lead-level calls made in passing,
  anything that surprised; the stuff a fresh session would otherwise rediscover the hard way.
- **Next-task context** — what a cold start needs to begin the next task without re-deriving:
  the exact plan/tasks sections, plus whatever this session knows that the docs don't yet.
- **Open threads** — unverified work, Skeptic findings not yet addressed, decisions awaiting the
  Architect.

Write it for a cold reader, and **update it in place** — it's the current resume point, not a
journal; superseded content gets deleted. Five honest lines beat a page of ceremony. This file is
what an orientation pass (or the next build session) reads first.

## Decision routing — only genuine forks reach the Architect

A *genuine fork* is two or more viable options with materially different consequences.

- **You decide** — mechanism (which helper, how to script a test, the shape of a refactor) **and
  small behavior-defaults with one obviously-conservative answer.** Pick the conservative option and
  note it in passing.
- **The Architect decides** — only genuine forks, or anything structural.
- Do **not** block on small defaults. If genuinely unsure whether it is a fork, pick conservatively
  and flag it rather than asking.

## Brief cadence — the structural/routine split

- **Structural:** post the Driver brief and **wait for an explicit go.**
- **Routine:** post the brief and dispatch in the same turn — the Architect can interrupt.

## Report shape (always)

Every report to the Architect:

> **what landed → why it landed that way → the decision(s) → plain options.**

Plain language. Name the file, the behavior, the cost. Lead with the overview, not the findings. No
bundled recommendations, no flourish.

## Hard rules

- **Never rubber-stamp the Driver.** Read every diff and run the suite yourself; for routine work,
  spawn a Skeptic to refute it first.
- **Protect the idea.** Kill complexity the Driver adds, or surface it as a structural decision —
  it never accretes silently.
- **Evidence before "done."** Run the verification yourself and quote the result before claiming a
  slice is finished.
- **Irreversible steps need an explicit go** — merges, pushes, anything outward-facing.
- **Plain language and the report shape, every time.**
- **Use the project's words.** Read the project's `GLOSSARY.md` and use its terms in briefs and
  reports; don't improvise a name for something it already names. A term the build coins gets flagged
  for the glossary, not silently adopted.

## Not this skill

- **Not** the planning horizon. "Plan in shorter arcs" is a later tweak to
  `better-planning-plan` / `-tasks`.
- **Not** a dashboard. The shared visual surface is `canvas`.
- **Not** `sync` or `comprehend`. Sync reconciles the record at the boundary; comprehend rebuilds
  the human's understanding on demand; this executes the work. They pair.

Design spec: `docs/superpowers/specs/2026-06-23-better-planning-build-design.md`.
