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

Five phase skills — brainstorm → prd → design → plan → tasks — plus two cross-cutting companions
(canvas, comprehend), one shared artifact space (`docs/better-planning/`), one objective: take a
fuzzy idea to buildable work with no ambiguity between human and agent. Each phase ends
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
| ⊕ | [`better-planning-canvas`](skills/better-planning-canvas/SKILL.md) | the family's interactive surface (not a phase): serve any explanation, review, or brainstorm as an HTML page with comment boxes; submissions wake the agent, the page reloads after each round. Works over SSH/tailnet where `file://` can't. |
| ⊕ | [`better-planning-comprehend`](skills/better-planning-comprehend/SKILL.md) | the during-build companion (not a phase): at each milestone or on demand, reconcile landed code against the TDD — teach the consequential deltas layered-zoom, update the living TDD, log drift to `<feature>-drift.md` — so the human's comprehension doesn't erode as agents build. |

> Maintainer note: `references/doc-layout.md`, `references/html-artifacts.md`, and
> `assets/overview-template.html` are intentionally duplicated across the family (now six skills) so
> each stays self-contained when installed individually. Edit all copies together.
>
> The original monolithic `better-planning` skill was retired in favor of this family
> (see git history).

## License

[MIT](LICENSE)
