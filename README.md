# skills

Agent skills by [@johanbuys](https://github.com/johanbuys), following the
[Agent Skills](https://github.com/vercel-labs/skills) conventions.

## Install

```bash
npx skills add johanbuys/skills
```

Or a single skill:

```bash
npx skills add johanbuys/skills --skill better-planning-brainstorm
```

## The better-planning family

Five phase skills — brainstorm → prd → design → plan → tasks — plus three during-build
companions (build, sync, comprehend), one shared artifact space (`docs/better-planning/`), one
objective: take a fuzzy idea to buildable work with no ambiguity between human and agent. Each phase ends
in a durable artifact that is the next phase's input **and** the resume point for a fresh
session — the artifact, not the conversation, carries the state. Each skill opens by reading
the planning space's status index (and routes you to the right sibling if you entered at the
wrong phase) and closes by offering the next one.

| Phase | Skill | Input → Output |
|---|---|---|
| ① | [`better-planning-brainstorm`](skills/better-planning-brainstorm/SKILL.md) | fuzzy idea → `<x>-brief.md` — the alignment record: decisions + rationale, open-question queue, glossary seeds. One decision per exchange, ephemeral HTML visuals for decisions easier seen than read. |
| ② | [`better-planning-prd`](skills/better-planning-prd/SKILL.md) | settled brief → settled `<x>-prd.md` + self-contained HTML companion. Review rounds with built-in review capture, full decision traceability. |
| ③ | [`better-planning-design`](skills/better-planning-design/SKILL.md) | settled PRD → `<feature>-tdd.md` + companion. System map, data model, interfaces, major decisions with alternatives, risks, NFRs, stack — walked layered-zoom one decision at a time, so the human stays the architect instead of rubber-stamping. The plan consumes it. |
| ④ | [`better-planning-plan`](skills/better-planning-plan/SKILL.md) | settled TDD → `<feature>-plan.md` + companion. Milestones that each end in a verifiable "run X, see Y" outcome; cites the TDD's architecture instead of re-deciding it; reality-disagrees protocol for the builder; adversarial cold-reader review before settling. |
| ⑤ | [`better-planning-tasks`](skills/better-planning-tasks/SKILL.md) | settled plan → `<feature>-tasks.md` — agent-executable tasks, each with links to the exact spec sections, files touched, and its own acceptance check. Optional GitHub-issues export under a user-chosen label. |
| ⊕ | [`better-planning-spike`](skills/better-planning-spike/SKILL.md) | the proving track (the ladder's pressure valve): scope a spike around one named question, build the smallest disposable answer with quality bars explicitly suspended, run the demonstration, then the mandatory harvest — findings with evidence into `research/`, fed to the brief; keeper code promoted by rebuilding under a plan, never merged. |
| ⊕ | [`better-planning-build`](skills/better-planning-build/SKILL.md) | build-time execution companion: run a slice of planned work as a small mob — the human as Architect making the calls, Driver/Skeptic subagents doing the typing — so authorship doesn't erode while agents build. |
| ⊕ | [`better-planning-sync`](skills/better-planning-sync/SKILL.md) | milestone-boundary reconciliation: the agent reads the diff, classifies every architectural delta, updates the living TDD, logs drift to `<feature>-drift.md` — then hands the human a one-screen digest where only genuine forks ask for a decision. Satisfies the gate before the next milestone's tasks. |
| ⊕ | [`better-planning-comprehend`](skills/better-planning-comprehend/SKILL.md) | on-demand catch-up (pull, not ceremony): "catch me up", "explain how X works so I can feel it" — rebuilds the human's mental model shape-first in plain language, from the TDD when it exists or the code when it doesn't. No prerequisites, no bookkeeping, no quiz unless asked. |

The family's review rounds, walkthroughs, and one-decision-at-a-time loops all render through
[`canvas`](skills/canvas/SKILL.md) when it's installed — a **standalone**, served-HTML interactive
surface (not part of any family). The page is served so any machine on the network can open it, the
comment boxes live next to the thing being discussed, and submissions wake the agent and reload the
page live — so it works over SSH/tailnet where `file://` can't reach. Other skills sit on it too.

> Maintainer note: `references/doc-layout.md`, `references/html-artifacts.md`, and
> `assets/overview-template.html` are intentionally duplicated across the family so each skill
> stays self-contained when installed individually. The canonical copies live in `shared/` —
> edit there, then run `scripts/sync-shared.sh` to stamp every copy (`--check` detects drift).
>
> The original monolithic `better-planning` skill was retired in favor of this family
> (see git history).

## Standalone skills

Not part of the better-planning family — usable on their own.

| Skill | What |
|---|---|
| [`orient`](skills/orient/SKILL.md) | Cold-start orientation: "where are we and what's next?" answered with evidence — reads the planning space's status index, handoff docs, git state, and the tracker, digests them to one screen, flags records-vs-reality contradictions, and ends with the single highest-leverage next move routed to the skill that picks it up. Read-only. |
| [`pr-shepherd`](skills/pr-shepherd/SKILL.md) | Shepherd a PR from reviewed to merge-ready in one loop: run (or ingest) a code review, post findings on the PR, triage with one decision (fix now / issue / dismiss), dispatch a fix subagent per finding group, re-review every fix, commit per group, push, and file context-rich issues for the deferrals. Stops at merge-ready — never merges. |
| [`canvas`](skills/canvas/SKILL.md) | A served-HTML interactive surface for agents: present anything as a page with per-section comment boxes, and run a live loop where a browser submit wakes the agent and reloads the page. Works over SSH/tailnet where `file://` can't. Several skills sit on it (see above); also useful on its own. |
| [`study`](skills/study/SKILL.md) | A personal, cross-project learning queue + tutor. Capture topics worth understanding into a dumb home-dir backlog (`~/.study/topics.md`) from anywhere, then run a guided, canvas-driven, recall-checked deep dive on any one — grounded in your real code, a scaffolded sandbox, or purely conceptual. `better-planning-sync` and `-comprehend` feed it the rabbit holes they surface mid-build; works fully standalone. |

## License

[MIT](LICENSE)
