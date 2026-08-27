# The dojo — layout & protocol

One git repo holds the whole practice: learner model, log, tracks, katas. It is found from the
current directory (nearest ancestor with `.dojo/`; `$DOJO` overrides), so nothing lives in the home
dir and nothing needs a path in a config file. `.dojo/` is versioned — it *is* the history. Katas
commit under the learner's own identity, so the streak is visible in `git log`.

```
<dojo>/
  .dojo/
    learner.yaml        ← the whole memory; edited only in the Log phase, by the rule tables
    log.jsonl           ← one line per session, append-only, never rewritten
    tracks/<track>.yaml ← a ladder per track, written by `setup`, revised every 5th session
    clock               ← copied from the skill at init; `./check` calls it
    session.json        ← ephemeral, gitignored: {started_at, phase, kata_dir}; exists = session open
    page.json           ← ephemeral, gitignored: what the served page renders (references/serve.md)
    page-events.jsonl   ← ephemeral, gitignored: what the learner clicked; read it in the Log phase
    keys/<kata-id>.yaml ← the answer key: planted issues, rubric, hidden lists. NEVER in the kata dir.
  katas/<date>-<track>-<concept>-<slug>/{README.md, <starter>, <tests>, check, meta.yaml}
  experiments/          ← where a drill that got interesting is allowed to grow (TANGENTS.md too)
  .vscode/settings.json ← autocomplete off
  README.md
```

`scripts/init` scaffolds all of it, idempotently, in the current directory.

## learner.yaml
See `assets/learner-template.yaml`. No paths in it — the dojo is where the file is. Rules that keep it maintainable by an LLM:
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
{"date":"2026-08-25","track":"nest","concept":"dto-pipes","kata":"katas/2026-08-25-nest-dto-pipes-reject-bad-set","kind":"new","difficulty":2,"drill":{"kind":"fix-this","hit":true},"green":true,"time_to_green_min":9,"check_runs":3,"errors":2,"hints":1,"revealed":false,"confidence":4,"explain_back":2,"predict_hit":true,"narrowed":false,"prep":"nest/guards — docs + one course section","transition":"introduced->practiced","next":"nest/guards","note":"forgot whitelist:true; flag cleared"}
```
`predict_hit` (bool|null — did last night's prep hold up), `narrowed` (bool — was this the cold-start
kata), `prep` (what was assigned for tomorrow). When the page is in use, `drill.hit`, `check_runs`,
`confidence` and `predict_hit` are **read from `page-events.jsonl`**, not recalled — see
`references/serve.md`. Without the page they are asked, and `null` is honest when they were not.

Attendance = `scripts/streak`: sessions · green · distinct days in the last 7 (target 5).

## tracks/<track>.yaml — see references/setup.md for the shape.

## session.json — the open-session marker
`{"started_at": "<ISO, UTC>", "phase": "drill|setup|kata|review|debrief", "kata_dir": "…"}`.
Its existence means a session is open. `.dojo/clock` reads it so `./check` prints the clock;
`scripts/context` shouts UNLOGGED SESSION if it survives to the next start. Deleting it closes the
session. Nothing reads it unless run.

## keys/ — the answer key never ships with the kata
Planted-bug lists, rubrics and hidden issue counts live in `.dojo/keys/<kata-id>.yaml`, versioned,
and never in the kata directory. `meta.yaml` says what the kata *is* (id, kind, track, concept,
lang, difficulty, `scored`); it does not say how many issues were planted. A learner who can read
"5 planted" mid-review is playing hunt-until-five, and the false-positive score stops meaning
anything.

## Two commits per kata — the write guard
1. `kata(setup): <track>/<concept> — red` — by the agent, right after scaffolding. The line.
2. `kata(<track>): <concept> — green 9m` — by the learner, under their own git identity. The done signal.
`scripts/context` prints the authorship of the last kata's commits; any agent-authored commit after
`kata(setup)` is drift and gets said out loud.

## Templates
`assets/templates/<lang>/check` — executable, runs from its own dir, exit 0 = green, prints one line
plus the clock, < 10 s. A track may ship its own under `.dojo/tracks/<track>.check`.
