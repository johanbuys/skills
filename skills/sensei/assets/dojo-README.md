# dojo

Hand-written code only. Twenty minutes a day; the sensei picks, you write. The reading happens the
night before, anywhere; the box is for practice.

- `.dojo/` — the learner model, the session log, one ladder per track. Versioned: this is the history.
- `lessons/<track>/` — one lesson per ladder rung, written the evening before it is needed. Read it anywhere.
- `capstone/<name>/` — the real app the learn track builds. Every kata is a brick carved in place here; it runs.
- `katas/` — one directory per session. The agent commits the red scaffold (`kata(setup)`); you commit the green.
- `experiments/` — where a drill that got interesting is allowed to grow.

Start a session: `/sensei`. Add a track: `/sensei setup <track> [capstone]` or `--sharpen`.
Autocomplete is off in this workspace on purpose — reps only count when they're yours.
