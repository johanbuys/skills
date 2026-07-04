---
name: better-planning-spike
description: "The better-planning family's proving track — when the next thing to do is prove an assumption, not plan a product: scope a spike around one named question, build the smallest disposable thing that answers it (no PRD, no TDD, quality bars deliberately suspended, sandboxed on a scratch branch or scaffold), run it end-to-end, then run the mandatory harvest — write what was proven/disproven with evidence into docs/better-planning/research/, feed the brief's decisions, and deliberately promote (never merge) any code worth keeping. Use it whenever the user wants to prove something works before committing to plan it — \"let's PoC this\", \"spike it\", \"I want to stress-test the design against a real use case\", \"can we scaffold something quick and see\", \"for now I just want to prove this will work\" — and whenever a brainstorm or PRD session starts drowning a proving-stage idea in productization questions."
---

# Better Planning · Spike (the proving track)

The family's ladder — brief → PRD → TDD → plan → tasks — assumes the idea deserves a product's
worth of planning. At the proving stage it doesn't yet, and over-planning there is a real failure
mode, not a hypothetical: spec artifacts written before the core bet is proven steer the project
by their sheer existence, and answering PRD-grade questions ("what about teams? self-hosting?")
about an unproven idea is planning theater. A spike is the family's pressure valve: **when the
honest next step is *prove it*, build the smallest thing that proves it — and capture what you
learned so the planning that follows starts from evidence.**

The failure mode on the *other* side is just as real, and it's why this is a skill and not an
absence of one: spikes that end without a harvest evaporate. The code rots on a branch, the
insights live only in a dead session, and three weeks later someone re-derives them. **The
harvest is the deliverable. The code is exhaust.**

## Scope it — one question, named out loud

A spike begins by writing down, in one or two lines:

- **The question** — the riskiest assumption, phrased so it can be answered: "can X drive Y
  end-to-end?", "does approach A survive real data?" A spike with two questions is two spikes.
- **What "answered" looks like** — the run-X-see-Y demonstration that would settle it.

That's the whole spec. If a brief exists, note the spike under its open questions; if not,
don't create the planning space for this — the spike note travels with the harvest.

## Build it — fast, dirty, and sandboxed on purpose

- **Quality bars are suspended, explicitly.** No TDD, no review rounds, hardcode what isn't the
  question. Say so at the start so nobody (human or agent) polishes disposable code.
- **Sandboxed**: a scratch branch, a `spike/` directory, or a separate scaffold repo. Spike code
  never lands on main as-is — that's what makes the suspended bars safe.
- **Smallest thing that answers the question.** Every addition gets the test: "does this help
  answer it?" Stress-testing a design against a use case counts; a settings page does not.
- Stop when the question is answered — proven *or* disproven. A disproof that took a day is a
  spike that worked.

## Prove it — run the demonstration

Run the end-to-end demonstration and state the verdict plainly: **proven** (here's the run),
**disproven** (here's where it breaks), or **unresolved** (here's the wall we hit and what it
would take). No spin — a spike that "mostly works" is unresolved, not proven.

## Harvest it — mandatory, before the session ends

This step is the reason the skill exists. Write `docs/better-planning/research/<topic>-findings.md`
(create the space if absent — layout in `references/doc-layout.md`):

- the question and verdict, with the evidence (what ran, what it showed);
- what this **implies** — decisions the planning phases can now make on evidence;
- **code worth keeping** — paths and what each proves; kept as *reference*, promoted later by
  being rebuilt properly under a plan, never merged wholesale;
- **dead ends worth remembering** — what didn't work and why, so nobody walks in again.

Then feed it upstream: add the findings to the brief's Evidence section and settle any open
question the spike answered (with the findings doc as the citation). If the verdict changes the
direction, that's a brainstorm conversation — with evidence in hand.

## Route onward

- **Proven, direction holds** → offer the next planning phase (usually the PRD or the TDD), with
  the findings as input. The spike's shortcuts are now the plan's explicit TODO list.
- **Disproven** → back to better-planning-brainstorm with the findings; the brief's decided
  directions may need re-litigating, and now there's evidence to do it honestly.
- **The spike wants to become the product** ("this works, let's keep going on this code") — flag
  the trade explicitly: keeping spike code means paying its suspended quality bars back as debt.
  If the human chooses it, record that as a decision, not a default.

## What this skill is not

- Not the ladder: it writes no brief, PRD, TDD, plan, or tasks — it *feeds* them evidence.
- Not the builder: better-planning-build executes *planned* work with quality bars up; a spike
  is the opposite trade, and mixing them ruins both.
- Not a prototype-to-production pipeline: promotion happens by rebuilding under a plan, never by
  merging the sandbox.
