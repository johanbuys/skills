# Design: `study` skill + promoting `canvas` to standalone

**Date:** 2026-06-19
**Author:** Johan Buys (brainstormed with agent)
**Status:** Approved design, pending implementation plan
**Relates to:** the better-planning family; in particular `better-planning-comprehend`
(2026-06-19-design-comprehend-skills-design.md), which is the highest-value *source* for the queue.

## Problem

Two gaps, one new skill plus one refactor:

1. **Rabbit holes have nowhere to go.** The comprehend loop (and ordinary work) regularly surfaces a
   *knowledge gap* — "I don't actually understand how RRULE expansion works", "I've never really
   understood our token-refresh race". Chasing it in the moment is exactly the derail that breaks the
   current task. There is no *capture-now, learn-later* mechanism, so the gap is either chased
   destructively or forgotten. People also simply want to learn things unrelated to the current repo.

2. **Active recall has no home.** comprehend was deliberately kept *presented, not Socratic* — speed
   matters mid-build. But retention requires testing, not re-reading (the "fluency illusion"). A
   dedicated learning skill is the right place for quizzes and predict-first retrieval practice.

3. **The canvas is shared infrastructure wearing a family prefix.** `better-planning-canvas` is
   already described as a general interactive surface. The `study` skill is the second, unrelated
   consumer — the textbook trigger to extract it from the planning family.

## Solution overview — two work items

### A. Promote `better-planning-canvas` → standalone `canvas`

The canvas is a *skill* (a Python server + live feedback loop + page templates), too heavy to
duplicate and coherent on its own. De-prefix it so both families depend on it as shared
infrastructure.

- `git mv skills/better-planning-canvas skills/canvas`; update its `name:`/`description:` to a
  family-agnostic framing (still note it pairs with better-planning **and** study).
- Update every `better-planning-canvas` reference to `canvas` across the planning skills, comprehend,
  design, and the README.
- The duplicated *design-language* files (`html-artifacts.md`, `overview-template.html`) stay
  duplicated per the repo's self-containment philosophy — `study` gets its own copies. The canvas
  owns the *mechanics* (`scripts/canvas_server.py`, `references/canvas-pages.md`, the page templates).

### B. New standalone skill `study`

A personal, cross-project learning queue + codebase-grounded tutor. Own name, **no** family prefix,
lives in the same repo. Works with zero better-planning and zero comprehend.

## The protocol — the queue is dumb, the filesystem is the state

`~/.study/` is the skill's home (named after the skill, not under `~/.claude/`).

- **`~/.study/topics.md` is pure backlog.** One topic per line, nothing else — a bare topic, or a
  topic + free-form context if the author felt like typing it. **No status tags, no dates, no machine
  fields, no pattern-matching.** Sources append; the human hand-edits freely; it stays short.

  ```
  how does RRULE expansion actually work
  token refresh race in our auth client — taskpilot src/auth/refresh.ts
  investing
  solving a rubik's cube
  ```

- **A topic's state = its directory.** No `~/.study/<slug>/` ⇒ not started (just a queue line).
  Directory exists ⇒ picked up. Done ⇒ recorded *inside* the dir (the learning-record marks it).
  State is read by looking at the filesystem, never by parsing the queue.

- **Graduating removes the line.** When a topic is picked up, `study` derives a slug, scaffolds
  `~/.study/<slug>/`, and **moves the line + its free-form context out of `topics.md` into the
  workspace** to seed it. The queue shrinks as you act (GTD next-actions semantics); a topic is never
  in two places. Full picture: `topics.md` = not-yet-started, `ls ~/.study/*/` = started/done.

This means `study` edits `topics.md` (line removal) on graduate — correct queue behavior, and the
line is relocated, not lost.

### Sources — the line format *is* the contract

Anything that can append a line is a valid source; no source imports the skill:

- the human typing "add X to my study queue" (or editing the file directly),
- `study` itself,
- **`better-planning-comprehend`** (optional, graceful): when it surfaces a delta the human doesn't
  grok, it offers "park this in your study queue?" and appends a line with free-form code context
  (repo + path). comprehend works fully without `study`; `study` works fully without comprehend.
- later: a code-review or debugging skill; a cron/file-watch agent.

## The per-topic workspace — `~/.study/<slug>/`

Created only on dive (two-tier: cheap capture, rich only on commitment):

```
~/.study/<slug>/
  TOPIC.md            ← the seed: topic, why (mission), source/context, started date
  lessons/            ← canvas HTML lessons (served, interactive)
  resources.md        ← cited sources (primary references; no parametric trust)
  learning-record.md  ← insights, what's still fuzzy, the done marker; drives future sessions
  sandbox/            ← optional toy/example repo, when hands-on helps
```

## The dive — the teaching mechanism

When a topic is picked, `study` scaffolds the workspace and runs a **canvas-driven, recall-checked**
lesson, borrowing the high-value bits of Matt Pocock's `teach` skill and dropping the ceremony:

- **Pick the right medium for *this* topic** — `study` is a general tutor, strong at code but not
  limited to it. Three modes, mixable, chosen per topic:
  1. **Existing code** — topic carries a repo/file pointer (common when it came from comprehend):
     teach the concept *through the real implementation*.
  2. **Created or referenced sandbox** — a code topic with no source, or one where hands-on helps:
     scaffold a toy repo in `~/.study/<slug>/sandbox/`, or reference a known canonical repo.
  3. **No code at all** — "investing", "rubik's cube", "the Krebs cycle": diagrams, animations,
     worked scenarios, quizzes on the canvas; generic but cited.
- **Lessons live on the canvas** — served HTML, layered-zoom, with **interactive retrieval practice**
  (quizzes, predict-first) rather than passive reading. This is where the active recall kept *out* of
  comprehend lands, because retention needs testing.
- **Cite sources; don't trust parametric knowledge** — lessons are backed by real references in
  `resources.md`, so the human can reach primary sources and the agent isn't confidently teaching
  something subtly wrong.
- **A learning-record on the way out** captures what clicked and what's still fuzzy — retention aid,
  resume point for a future session, and where "done" is marked.

### The four verbs

- **capture** — append a line (from anywhere).
- **browse** — show the queue, help pick what to learn now.
- **learn** — derive slug, scaffold the workspace, run the canvas-driven dive.
- **record** — write/append the learning-record, mark the topic done in its dir.

## Independence & degradation

- `study` is fully standalone: it reads its own home-dir queue, needs no other skill.
- **Canvas optional-but-recommended:** if `canvas` is installed, lessons run live on it (works over
  SSH); if not, degrade to `file://` HTML lessons or a terminal-driven dive.
- **comprehend optional:** it's the highest-value contributor, never a dependency.

## The forward hook (designed-for, NOT in v1)

Because a topic's "started/ready" state is filesystem-derived (a dir exists, with research in it),
a later **cron/file-watch agent** can pre-scaffold and research `topics.md` lines in the background,
so a lesson is already prepped when the human sits down. The protocol needs no status tags to support
this — "ready" is just "a workspace with research exists." Out of scope for v1; the design must not
preclude it.

## Scope of changes (files touched)

### A. Canvas promotion

- `git mv skills/better-planning-canvas → skills/canvas`; rewrite `name:` → `canvas` and the
  `description:` to a family-agnostic framing (mentions both better-planning and study).
- Replace every `better-planning-canvas` reference with `canvas` in: `better-planning-brainstorm`,
  `better-planning-prd`, `better-planning-design`, `better-planning-plan`, `better-planning-tasks`,
  `better-planning-comprehend` SKILL.md, and `README.md`.
- README: the ⊕ canvas row moves out of the better-planning family table into a shared/standalone
  framing; the maintainer duplication note stays accurate.

### B. New `study` skill

- `skills/study/SKILL.md`
- `skills/study/references/study-layout.md` — the `~/.study/` protocol: queue format, the
  filesystem-as-state rule, graduate-removes-line, the append contract, the workspace layout.
- `skills/study/references/teaching.md` — the pedagogy: the three grounding modes, retrieval
  practice, citations/no-parametric-trust, zone of proximal development, learning-records.
- `skills/study/references/html-artifacts.md` — copy of the shared design language.
- `skills/study/assets/overview-template.html` — copy of the shared base template.
- `skills/study/assets/learning-record-template.md`, `skills/study/assets/topic-template.md`
  (TOPIC.md seed).
- `skills/study/evals/evals.json` — including: capture-a-line; graduate-removes-line-and-scaffolds;
  a code-grounded dive (existing repo); a non-code dive ("investing") that does NOT fabricate code;
  a sandbox-created dive; degradation when canvas absent.
- README: add `study` under a standalone-skills section (it is not a better-planning phase).

### comprehend integration (small, optional)

- `better-planning-comprehend/SKILL.md` — when a delta reveals a knowledge gap and `study` is
  available, offer to append a line to `~/.study/topics.md` with free-form code context. Stays
  graceful when `study` is absent.

## Open items for the implementation plan

- The exact slug-derivation rule (topic line → `<slug>` dir name) and collision handling.
- `study-layout.md` final wording of the append contract (so third-party sources can conform).
- Whether the lesson HTML reuses the canvas brainstorm-template loop or a study-specific lesson
  template; quiz/retrieval-practice component shapes on the canvas.
- README restructure: how to present "better-planning family + shared canvas + standalone study"
  without implying study is a planning phase.

## Rejected alternatives (summary)

- **Status tags in the queue** (`[learning]`, `[learned 2026-06-20]`) — rejected: turns the queue
  into a stateful database needing pattern-matching; filesystem-as-state is cleaner.
- **Backlog as its own skill** — rejected: capture is one appended line; the backlog is a *protocol*,
  not a skill. One skill (`study`) consumes + teaches; sources just append.
- **Per-topic dirs created at capture** — rejected: adds friction to capture and clutters with
  never-chased topics. Two-tier (flat queue → workspace on dive) keeps capture free.
- **Code-only tutor** — rejected: `study` must handle non-code topics; grounding is a strength, not a
  gate.
- **Keeping canvas under the better-planning prefix** — rejected: a second consumer makes it shared
  infrastructure; the prefix would misrepresent it.
- **Duplicating the canvas mechanics into `study`** — rejected: duplicating a Python server is far
  heavier than duplicating a markdown reference; canvas is a coherent shared skill dependency.
