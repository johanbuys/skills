# Design note — a served session surface for sensei

**Date:** 2026-08-26 · **Status:** implemented 2026-08-27

## The evidence

Two real diagnostic sessions in `~/projects/dojo`, plus the learner's own account of them.

**The clock was invisible and the wall was unexplained.** Time is only readable by running
`./check`. The learner reported no ambient sense of how long was left, and — worse — reported
feeling they had to *submit before the count ran out*. That pressure is an artefact, not a design
goal: `references/rules.md` already says an unfinished session is logged `green:false`, so there is
nothing to rush. Both sessions overran anyway (diag-1 by 17 min, diag-2 by 1 min).

**The review kata's interface made the learner do clerical work.** `REVIEW.md` is written by hand
against `CHANGES.diff`, so anchoring a comment means counting `+` lines to find that
`orders.controller.ts:9` is the `@Body() dto: any` line. Twenty minutes is too short to spend any
of it counting.

**`check` cannot see the failures that matter.** In diag-2 the third comment's body is a verbatim
copy of the second — right heading, wrong text — because the learner ran out of time mid-block.
`check` counts `## ` headings and words, so it passed. Nothing told them. It also cannot tell that
a comment is anchored to a line that exists in the diff, and false positives are on the rubric.

**Measured fields are being reconstructed from memory.** Both log lines carry `"confidence":null`
and `"drill":null`; diag-2 also has `"explain_back":null`. These are asked at minute 19, about
things that happened at minutes 2 and 14.

## What this is

One page, one URL, for the whole twenty minutes, served by sensei's own script. Phases
**accumulate** on it — a finished phase collapses to a one-line strip you can reopen, the active
phase is the expanded card, what is coming sits dimmed below. Same shape as canvas's brainstorm
page (decided log above, active thing centre, queue below).

Not a page per phase: the clock is continuous, and you want to scroll back to the micro-lesson's
snippet while writing the kata.

### Three surfaces, hard boundaries

```
  ┌─ THE PAGE ────────────────┐   anything you commit to BEFORE seeing
  │  clock · phase · cards    │   the answer, plus what is structural:
  │  drill · lesson · review  │   the diff, the snippet, done-when,
  │  explain-back · log       │   check output. Never code.
  └───────────┬───────────────┘
              │  POST /commit, /file, /check
  ┌───────────┴───────────────┐
  │  scripts/serve            │──── .dojo/page.json      (agent writes, page polls)
  │  localhost:3119, 0.0.0.0  │──── .dojo/page-events.jsonl (page writes, agent reads at Log)
  └───────────┬───────────────┘
              │
  ┌───────────┴───────┐   ┌────────────────────┐
  │  THE EDITOR       │   │  THE TERMINAL      │
  │  owns code.       │   │  owns dialogue.    │
  │  VS Code, the     │   │  Socratic hints,   │
  │  compiler, the    │   │  the hint ladder,  │
  │  red squiggle.    │   │  one question/turn.│
  └───────────────────┘   └────────────────────┘
```

The through-line is the first box: **the page exists to make the learner commit before they see.**
In a terminal the answer scrolls past with the question. On a page you click, and only then does it
open. Everything else the page does is chrome around that.

## The four pieces

**1. `scripts/serve`** — one script beside `scripts/clock`, no dependencies beyond python3. Finds
the dojo the same way (`scripts/dojo-root`), binds `0.0.0.0` so it is reachable over SSH/tailscale,
self-exits after 15 minutes idle so a forgotten server is self-correcting.

| endpoint | does |
|---|---|
| `GET /` | the static page shell — one file, never regenerated per phase |
| `GET /state` | `.dojo/page.json` verbatim; the page polls it every ~2s and re-renders on a version bump |
| `POST /commit` | appends one learner action (drill answer, prediction, confidence, label, explain text) to `.dojo/page-events.jsonl` |
| `POST /file` | write-through to **one** path named in `state.writable`. Nothing else is writable. |
| `POST /check` | runs exactly `<kata_dir>/check`, no arguments, returns exit code + stdout |

`/check` takes no parameters and `/file` takes no path, only content — both targets come from
`page.json`, which only the agent writes. That is the entire attack surface of a `0.0.0.0` bind.

**2. `.dojo/page.json`** — the state the agent writes and the page renders. Ephemeral, gitignored.
`session.json` is untouched and remains the open-session marker `clock` reads, so the no-hooks story
is unchanged.

```json
{ "v": 7, "date": "2026-08-28", "track": "nestjs", "concept": "dto-pipes",
  "started_at": "…", "phase": "kata", "kata_dir": "katas/…",
  "headline": "DTOs and validation pipes — a POST returns 400 on a bad body",
  "why": "first unlocked ladder item; settles an open flag",
  "writable": [],
  "prep": { "for": "…", "rows": [ {"kind":"video|docs|code", "text":"…", "min":6} ] },
  "cards": [ {"kind":"choice", "…":"…"}, {"kind":"kata", "…":"…"} ] }
```

Card kinds: `choice` (drill and the predict question — commit-before-reveal), `lesson`, `kata`,
`review` (the diff commenter), `explain`, `log`, `prep`.

**3. The page shell** — static, generic, checked into the skill. Every word in it comes from
`page.json`. This is both the correct design and the cheap one: canvas measured roughly 80% token
waste from regenerating markup per round instead of writing state.

**4. The review card** — the diff commenter. Gutter line numbers computed from the hunk headers
(`@@ -0,0 +1,34 @@` already carries them), click a line to open a composer with the anchor
pre-filled, three required fields matching the kata's own What / Why / Instead, autosave to
`REVIEW.md`. The `check` for review katas then gets two assertions it cannot make today: every
comment has all three parts, and every anchor is a line that exists in the diff.

## Rule changes

**R1 · The browser is an editor, not the agent.** Amends the hard rule *"The kata directory is
hand-written after `kata(setup)`"*. A write through `POST /file` carries the learner's authorship,
exactly as VS Code saving the file does. The agent still may not write into the kata dir after
setup, and the audit is unchanged: `scripts/context` prints the commit authorship. Without this
written down, the review card reads as drift.

**R2 · The page never owns code.** `state.writable` may name only prose the learner authors —
`REVIEW.md`, a design one-pager. Never a source file. A `kata` card shows done-when, the file path,
the `TODO(human)` region, the check button and the output, and stops. During a code kata the
compiler is the teacher; a browser textarea would take that away.

**R3 · A narrowed kata cannot promote a concept.** New row in `references/rules.md`, above the
existing green rows:

| outcome | state | next due |
|---|---|---|
| green ∧ narrowed (cold start) | keep | +1d, same concept tomorrow at full width |

Without it, the adaptive branch below quietly inflates the learner model — which is the one thing
that file exists not to do.

**R4 · The Log phase assigns tomorrow's input.** New output of phase 5, alongside the three lines.

## Prep, and the cold branch

**Twenty minutes is plenty to practise and useless for input.** Reading and watching are cheap and
portable; writing code is neither. Spending scarce hands-on minutes on exposition is the worst
trade available. So the real budget is ~10 minutes of input *anywhere* plus 20 minutes of hands *at
the desk*, and the box assumes the input happened.

The Log phase names tomorrow's input specifically: one course section (from the `sources` the
ladder's `setup` already chose), one docs section, and — best of the three — the agent-scaffolded
capstone code already tracked in `capstone.scaffolded`, which becomes a *read this* drill later
anyway.

**The check on it already exists.** The micro-lesson's predict-first question is the entry ticket.
Nothing asks the learner to tick a box; self-reported prep is worthless.

- **Predict hit** → the lesson card collapses to a bridge, full-width kata, normal rules.
- **Predict miss** → *cold start*. The lesson card hands over the sixty seconds that were skipped
  (one worked snippet), the kata narrows — one rule instead of three, one worked example given,
  fewer tests — and R3 applies: green still counts as attendance and is still committed under the
  learner's name, but the concept stays put and comes back tomorrow at full width.

This distinction only differs for **learn** tracks. A sharpen track needs no input: the model is
already there, what decays is retrieval, and 20 minutes of drill-plus-kata is self-sufficient.

## New log.jsonl fields

`predict_hit` (bool|null), `narrowed` (bool), `prep` (string, what was assigned). And the fields
that are currently `null` become measured, because every one of them is now a click:
`drill.hit`, `check_runs`, `confidence`, `explain_back`. Update the line documented in
`references/layout.md`.

## Cross-cutting changes

- `skills/sensei/scripts/serve` — new.
- `skills/sensei/assets/page.html` — new, the static shell.
- `skills/sensei/references/serve.md` — new: the endpoint and `page.json` contract above.
- `skills/sensei/references/rules.md` — the R3 row.
- `skills/sensei/references/layout.md` — `page.json` and `page-events.jsonl` in the tree, both
  gitignored; the extended log line.
- `skills/sensei/SKILL.md` — R1 and R2 in Hard rules; the prep assignment in phase 5; one line in
  "No hooks, by design" saying the page is optional and every phase keeps its terminal path.
- `skills/sensei/scripts/init` — gitignore the two new ephemeral files.
- `assets/templates/*/check` — the stronger review assertions.

## Build order

1. **The HUD and the kata card.** Clock, phase, done-when, `run ./check` with output. Shared chrome,
   useful for every kata kind, and it is the piece that fixes the reported pressure. Ship alone, use
   it for a week.
2. **The review card.** The diff commenter and the stronger `check`.
3. **The choice, lesson, explain, log and prep cards.**

## Open decisions

1. **`meta.yaml` leaks `planted_issues: 5`** into a directory the learner reads mid-kata, which
   turns a review into hunt-until-five and makes the false-positive score meaningless.
   Recommend moving planted counts out of the kata dir into `.dojo/`.
2. **Rubric visibility.** Hidden during diagnostics (it would inflate the baseline), visible for
   normal katas (it teaches the shape). Needs confirming.
3. **Explain-back crosses surfaces.** The page collects the free-text answer; grading it 0/1/2 is
   the agent's job in the terminal. That is the one phase where the learner looks at both screens.
   Accept, or move grading onto the page?

## What changed during implementation

- **The page does not decide the cold branch.** It renders whatever `page.json` says. The agent
  reads the missed prediction from `page-events.jsonl` and rewrites the state, so the branch lives
  in the rule tables with every other state change instead of in browser JavaScript.
- **Answer keys got their own home.** `.dojo/keys/<kata-id>.yaml` rather than "move the count out of
  meta.yaml" — planted lists, rubrics and hidden scoring all have the same problem and now the same
  answer.
- **A drill-kind rule came out of the diagnostics.** The baseline says recognition holds and
  generation does not, so `references/rules.md` now weights the deck towards the kinds that make the
  learner produce (`fix this`, `solve this`, `review this`) and away from `which pattern?` and
  `reorder this`. The reverse applies to a learner whose baseline says the opposite.
- **`GET /events` was added** so a browser refresh mid-session loses nothing.

## The principle this encodes

The page earns its place by doing two things a terminal cannot: it makes the learner **commit
before they see**, and it **measures what was previously remembered**. Both were already in the
skill's design — predict-first questions, a log line full of measured fields — and both were
quietly failing in practice. Everything else here is chrome around those two, which is why the
kata card is the thinnest card of the day and why none of it is allowed to become required.
