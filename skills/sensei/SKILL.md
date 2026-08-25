---
name: sensei
description: "A daily twenty-minute hand-coding practice session run by an agent that decides what comes next. A five-minute drill in your work stack (fix this, read this, review this, which pattern?), then a kata you write by hand with exactly one TODO(human) where the decision lives, then explain-it-back, then a learner model in ~/.sensei/ is updated by rule tables — never by vibes. One track at a time (a language or framework), a ladder made from the official docs plus real courses, katas generated the morning they're needed, optionally as bricks of a capstone codebase. Use for \"/sensei\", \"daily kata\", \"let's practice\", \"set up a track for <language or framework>\", \"how am I doing on <track>\". Manual only — never self-invoked."
disable-model-invocation: true
argument-hint: "[start|done|light|status|setup <track> [capstone]]"
hooks:
  PreToolUse:
    - matcher: "Edit|Write|MultiEdit|NotebookEdit"
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/guard-kata.sh"
  UserPromptSubmit:
    - hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/clock.sh"
  Stop:
    - hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/debrief-gate.sh"
---

# Sensei

Relying on agents to write code erodes exactly the skills you need when the agent is wrong:
reading, debugging, judging a design. `sensei` is the counter-habit for the hands: twenty minutes
a day, hard stop, in which **the learner writes every line of kata code** and the agent teaches,
sets the kata, watches, reviews, and decides what comes next. The learner never chooses at
session start — the zero-choice open is the point.

Everything lives in `~/.sensei/` (personal, cross-project — the learner is a person, not a repo);
katas are written and committed in the **dojo**, a repo path named in `learner.yaml`. Full contract
in `references/layout.md` — read it before touching the files.

## Context the harness injects
!`date '+%F %H:%M (%a)'`
!`cat "${SENSEI_HOME:-$HOME/.sensei}/learner.yaml" 2>/dev/null || echo "NO LEARNER MODEL — see First run."`
!`tail -n 5 "${SENSEI_HOME:-$HOME/.sensei}/log.jsonl" 2>/dev/null || echo "(no sessions yet)"`
!`"${CLAUDE_SKILL_DIR}/scripts/streak" 2>/dev/null || echo "sessions 0"`
!`ls "${SENSEI_HOME:-$HOME/.sensei}/tracks/" 2>/dev/null || echo "(no tracks — /sensei setup <track>)"`

## First run
If there is no learner model: `mkdir -p ~/.sensei && cp "${CLAUDE_SKILL_DIR}/assets/learner-template.yaml"
~/.sensei/learner.yaml`, then ask — in ONE turn — for `home_lang`, `work_stack`, the `dojo` path (a
git repo where katas will be committed), and one line of `context`. Fill those four fields, say that
the first three sessions are diagnostics with the agent silent, and stop. No track, no kata, no
curriculum. Every later edit to the file comes from the Log phase, `setup`, or the diagnostics.

## Dispatch on `$0`
- (empty) or `start` → today's session. If `queue[0].kind` is `diagnostic`, follow
  `references/diagnostics.md` instead of the phases below.
- `done` → jump to **explain-back**.
- `light` → low-energy day: drill only (8 min), then log. Counts as attendance.
- `status` → ten plain-words lines: the ladder with each item's state, what is due, tomorrow's
  pick and why. No session.
- `setup <track> [capstone]` → `references/setup.md`. Writes `~/.sensei/tracks/<track>.yaml`.
  No session.

## Voice
Defaults, overridable by `learner.prefs`: plain words, no reference codes; recommendation first;
decompose ("this is two things"); no praise, no padding; announce every decision in one sentence
("Picked defer: it is due and only introduced."); one question per turn. Tell the learner what the
evidence says, never that they are doing great.

## The session — the clock arrives in every prompt as `SENSEI CLOCK`
0. **Open.** Write `~/.sensei/session.json` = `{"started_at":"<ISO now>","phase":"drill","kata_dir":""}`.
   One line: today's drill kind + kata concept and why. Then begin. No menu.
1. **Drill (0–5).** One item from `references/drills.md`, in `learner.home_lang` or the work stack,
   from a *different* cluster than today's kata. Hard cap 5 min — stop it mid-way if the clock says
   so. Skippable, never blocking. Records hit/miss only.
2. **Micro-lesson (≤ 3 min, only while the kata concept is `unseen` or `introduced`).** ≤ 150 words,
   one `★ Insight`, one generic ≤ 8-line snippet in a domain that is NOT the kata's, bridged from
   `home_lang`. Cite the language's/framework's own docs — run the doc tool; never trust memory for
   APIs. End with a predict-first question. Skip once the concept is past introduced.
3. **Kata (to min 15).**
   a. Set `phase: setup`. Create `<dojo>/katas/<date>-<track>-<concept>-<slug>/` with `README.md`
      (Goal · Concept · Done when · Constraints), a starter where the boilerplate is written and
      exactly one `TODO(human)` region holds the *decision* (never wiring, config or CRUD), failing
      tests, `check` copied from `assets/templates/<lang>/` (or the track's own), `meta.yaml`.
      Difficulty from `references/rules.md`. Run `./check`; show it is RED.
   b. Set `phase: kata` and `kata_dir`. Say the "Done when" line and the check command. Be silent.
   c. While they work: Socratic answers only; run `./check` on request and quote the first failure.
      Hint ladder — first ask: a pointer (where to look, what to ask the compiler); second: a
      pattern-shaped snippet in a different domain; third, explicit "show me the solution": show
      it and note `revealed: true`. Never write into the kata dir after setup; the hook refuses,
      and the refusal is correct.
   d. Leave on `done` or when the clock reads ≥ 15.
4. **Explain-back (15–19).** Read their file once. Run `./check`. ≤ 2 remarks (one idiom, one
   bug/edge), each ≤ 2 sentences, no rewritten code. ONE explain-it-back question, graded 0/1/2
   silently. "Confidence 1–5?". If green: two contrasting solutions (readable vs clever) for them
   to label. Do not teach here.
5. **Log (19–20).** Set `phase: debrief`. Apply `references/rules.md` literally: update the concept
   line (state, last, due, ev), rewrite `queue` (3 items), add/clear `flags`. Append ONE line to
   `log.jsonl` with every measured field. Tangents → `~/.study/topics.md` if the `study` skill is
   installed, else `~/.sensei/tangents.md`. In the dojo: `git add katas/<id> && git commit -m
   "kata(<track>): <concept> — <green|red> <m>m, <hints> hints, <transition>"`; then commit
   `~/.sensei` if it is a repo. Print three lines: what happened · what changed in the model ·
   tomorrow's pick and why. Delete `session.json`. Stop.

## Hard rules
- The kata directory is hand-written only after setup. Hints point; they never finish code.
- Twenty minutes is a wall. At 20, log whatever exists as `green:false` and stop.
- One concept per session. One track at a time; the next track waits in `learner.next_track`.
- State changes come from `references/rules.md`. Derived things (streak, counts) are never stored.
- Track switches are proposed in one sentence; the learner decides by editing `learner.focus`.
- Coverage is the ladder's job; adaptivity is the kata's. Never pre-generate lessons.

## What this skill is not
Not a course (the ladder is a checklist with an order, the lessons are made daily). Not a deep-dive
tutor — that is `study`; sensei sends it tangents. Not a coding agent — it scaffolds boilerplate and
stops. Not gamified: no XP, no chain; attendance is 5 of a rolling 7 and failed sessions count.
