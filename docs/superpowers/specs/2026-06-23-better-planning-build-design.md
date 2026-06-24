# Design: `better-planning-build` — paired execution companion (Architect / Lead / Driver)

**Date:** 2026-06-23
**Author:** Johan Buys (brainstormed with agent)
**Status:** Settled (2026-06-23) — ready for `SKILL.md`

## Problem

The better-planning family takes a fuzzy idea to buildable work (brainstorm → prd → design →
plan → tasks), and `comprehend` defends the human's *understanding* as code lands. But there is
still no defined way to **execute** the work that keeps the human in control. Today execution is
handed to an unattended loop (e.g. ideoshi-code): it grinds tasks T1…Tn and lands large milestone
PRs. The human plans well, goes dark during the build, then rubber-stamps a 3,000-line green PR.

Two failures, both seen live on stet PR #88 (M4 thin review slice):

1. **The human stops being the creator.** A simple idea becomes a complex artifact the human never
   shaped, decision by invisible decision. Worst on greenfield, where the system gets complex
   before the human ever experiences it running.
2. **Green tests hide real defects.** #88 looked clean; a paired skeptic pass found the steel
   thread was hollow (a real model's findings were silently dropped) plus a latent gating bug —
   both invisible per-PR, visible only by reading across the milestones.

`comprehend` addresses understanding *after* code lands. This skill addresses the *act of building*:
keep the human the architect **during** execution, not just re-synced after it.

## Objective

Execute a slice of planned work with the human as the **Architect** in the loop — making the calls
that matter at the altitude of the idea — while agents do the typing and complexity is fought in
real time. Output: working, verified code the human owns, not a rubber stamp.

## Where it sits in the family

The family's **second build-time companion**, alongside `comprehend`. comprehend keeps
understanding current; build keeps authorship current. They pair: `build` executes a slice →
`comprehend` reconciles at the milestone boundary.

```
①brainstorm → ②prd → ③design → ④plan → ⑤tasks ──→ [build / execution]
                                                          │
                        ⊕ comprehend  (re-sync understanding) ─┐
                        ⊕ build       (execute a slice)        ┘  paired build-time companions
```

## The roles

- **Architect** (human) — holds the intent, makes the calls, can take the wheel. (The family's
  existing word for the human.)
- **Lead** (main agent session) — translates intent into tight Driver tasks, dispatches,
  **protects the idea / fights complexity**, surfaces decisions to the Architect at intent
  altitude, and verifies the Driver's work itself. Spawns Skeptics and Scouts. (Replaces
  "coordinator" — that name collides with stet's phase-coordinator — and "senior".)
- **Driver** (subagent) — stateless hands; does one bounded task test-first; returns a small diff.
- **Skeptic** (subagent) — independent verifier; tries to refute the Driver's diff (or a review
  finding) before it reaches the Architect. The Lead never marks its own homework.
- **Scout** (subagent) — parallel research; surfaces how existing code works so the Driver reuses
  rather than reinvents.

## The loop (one slice)

1. **Classify the slice: structural or routine.** Structural = core types, interfaces, the walking
   skeleton, anything other code depends on. Routine = bounded work inside an already-decided shape.
2. **Skeptic pass** (when reviewing existing or loop-produced code): fan out independent finders;
   the Lead verifies the load-bearing finding itself; dedupe to the few that matter.
3. **Report to the Architect** in the fixed shape (below): what landed → why → the decision(s) →
   plain options.
4. **Driver brief** for each call the Architect makes — test-first, scoped, with a stop-and-report
   clause for anything beyond scope.
5. **Driver runs**; returns a small diff.
6. **Lead verifies** the diff itself (reads it, runs the suite) — never the Driver's word.
   Surfaces any Driver deviation.
7. **Commit / merge** with a review trail (a plain-language summary comment), and only on the
   Architect's explicit go for irreversible steps.
8. **Offer `comprehend`.** When the slice or milestone lands, offer to run `comprehend` to
   reconcile what landed against the design of record — the family handoff that closes the loop
   (build does the work, comprehend keeps the Architect's understanding of it current).

## The master dial: structural vs routine governs everything

The structural/routine line is the single control. It sets both **what reaches the Architect** and
**whether a brief is pre-approved**:

| | Structural work | Routine work |
|---|---|---|
| Who decides | Architect | Lead (mechanism) |
| Brief cadence | approve-first | show-and-run (interruptible) |
| Automation | low — Architect watches each move | high — Lead runs several, checks in at the boundary |

A routine task that turns out to be structural **stops and escalates**. "Automation = leash length"
is just how many routine steps the Lead runs between check-ins.

## Decision routing (derived from the dial)

The Architect's time is spent only on **genuine forks** — two or more viable options with
materially different consequences. Everything else the Lead decides and reports.

- **Lead decides** — mechanism (which parse helper, how to script a test, the shape of a refactor,
  which subagent) **and small behavior-defaults that have one obviously-conservative answer**.
  Example from #88: provisional confidence = `"low"` — the Lead picks it and notes it in passing;
  it is not a fork.
- **Architect decides** — only genuine forks: a real choice between options with different
  consequences, or anything structural. Examples from #88: A-vs-B on the protected
  tests; skip-coordinator vs hold-the-floor on degraded verify.
- The Lead does **not** escalate small defaults. If it is genuinely unclear whether something is a
  fork, the Lead picks the conservative option and flags it rather than blocking on a question.

## Brief cadence (derived from the dial)

Default: **show-and-run.** The Lead posts the Driver brief and dispatches in the same turn; the
Architect can interrupt. **Exception:** structural work, or any brief that embeds a flagged
decision, waits for an explicit go.

## Report shape (locked)

Every Lead report to the Architect:
**what landed → why it landed that way → the decision(s) → plain options.**
Plain language; name the file / behavior / cost; no bundled recommendations or flourish; lead with
the overview, not the findings. (Both corrections the Architect made during the first run.)

## What this is NOT (scope guard)

- **Not** the planning-horizon change. "Plan in shorter arcs" (generate tasks one milestone at a
  time) is a later tweak to `better-planning-plan` / `-tasks`, not this skill.
- **Not** a dashboard. The shared visual surface uses the existing `canvas`; assets may live here,
  but no standing dashboard is built.
- **Not** a replacement for `comprehend`. They pair.

Bundling those three was the exact over-ambition this methodology fights.

## Evals (sketch)

Model on `comprehend`'s `evals.json` (trigger prompt + narrative `expected_output` + `assertions` +
fixture). stet PR #88 is a ready-made fixture: a loop-produced PR with a hollow steel thread + a
latent bug.

- Prompt: *"Here's a loop-produced PR — review it and drive the fixes the paired way."*
- Expected: classify structural/routine; run a skeptic pass; the Lead verifies the load-bearing finding
  itself; reports in the fixed shape; briefs the Driver test-first; verifies the diff itself;
  never rubber-stamps; commits with a review trail.
- Assertions: `surfaces-decisions-at-intent-altitude`; `lead-verifies-not-driver`;
  `escalates-what-not-how`; `report-shape-what-why-decisions-options`; `review-trail-on-merge`;
  `structural-touch-escalates`.

## Decisions (settled 2026-06-23)

1. **Names** — Architect (human) / Lead (main session) / Driver / Skeptic / Scout; skill
   `better-planning-build`.
2. **Decision routing** — only genuine forks (≥2 viable options, materially different consequences)
   reach the Architect. The Lead decides mechanism *and* small behavior-defaults, and reports them.
3. **Brief cadence** — the structural/routine split: approve-first for structural, show-and-run for
   routine. No trust-ramp — the split applies from the start.
4. **Report shape** — what landed → why → the decision(s) → plain options. Plain language; name the
   file / behavior / cost; lead with the overview.

## Next steps

spec (this) → `SKILL.md` (trigger description + procedure) → `references/` (driver-brief template,
skeptic dispatch, report shape) → `evals/evals.json` (#88 fixture). The planning-horizon change (A)
and the visual surface (C) are separate, later.
