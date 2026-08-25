# `~/.sensei/` layout & protocol

Personal and cross-project: the learner is a person, so the model lives in the home dir (override
with `SENSEI_HOME`). Katas live in the **dojo** — any git repo path named in `learner.dojo` — so the
work is committed under the learner's own identity and the streak is visible in `git log`.

```
~/.sensei/
  learner.yaml        ← the whole memory; edited only in the Log phase, by the rule tables
  log.jsonl           ← one line per session, append-only, never rewritten
  tracks/<track>.yaml ← a ladder per track, written by `setup`, revised every 5th session
  session.json        ← ephemeral: {started_at, phase, kata_dir}; the hooks read it
  tangents.md         ← rabbit holes parked (only if the `study` skill is not installed)
<dojo>/
  katas/<date>-<track>-<concept>-<slug>/{README.md, <starter>, <tests>, check, meta.yaml}
  experiments/        ← where a drill that got interesting is allowed to grow
```

## learner.yaml
See `assets/learner-template.yaml`. Rules that keep it maintainable by an LLM:
- **Only touched concepts appear**; absent = unseen. `state ∈ {introduced, practiced, fluent}`;
  `rusty` is derived (today > due + 14d) and never written.
- Every concept line carries `last`, `due`, and one line of `ev` (evidence: kata id + what happened).
- `queue` is exactly three items, top = next, rewritten at every Log.
- `flags` are misconceptions in one line each; a line is deleted when a kata disproves it.
- `baseline` is written once, after the diagnostics.
- `learn` names the one track being climbed (`focus` once set up); `sharpen` lists tracks that only
  feed drills and reviews. Their concepts share the same `concepts` map, namespaced `<track>/<slug>`.
- Nothing countable is stored. Streak and totals come from `scripts/streak` over `log.jsonl`.

## log.jsonl — one line per session
```json
{"date":"2026-08-25","track":"nest","concept":"dto-pipes","kata":"katas/2026-08-25-nest-dto-pipes-reject-bad-set","kind":"new","difficulty":2,"drill":{"kind":"fix-this","hit":true},"green":true,"time_to_green_min":9,"check_runs":3,"errors":2,"hints":1,"revealed":false,"confidence":4,"explain_back":2,"transition":"introduced->practiced","next":"nest/guards","note":"forgot whitelist:true; flag cleared"}
```
Attendance = `scripts/streak`: sessions · green · distinct days in the last 7 (target 5).

## tracks/<track>.yaml — see references/setup.md for the shape.

## session.json — the hooks' contract
`phase ∈ {drill, setup, kata, review, debrief}`. `guard-kata.sh` denies agent writes under
`kata_dir` unless phase is `setup`. `clock.sh` injects `SENSEI CLOCK: m/20 · phase` on every prompt.
`debrief-gate.sh` blocks ending the turn while a session is open unless phase is `debrief` and
`learner.yaml` was modified after `started_at`. Deleting `session.json` closes the session.

## Templates
`assets/templates/<lang>/check` — executable, runs from its own dir, exit 0 = green, prints one
line, < 10 s. A track may ship its own under `tracks/<track>.check` when the language has none.
