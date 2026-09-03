# The served session page — contract

Optional surface. Every phase keeps its terminal path; the clock still rides on `./check`. Start it
when the learner wants it, skip it when they don't. Nothing in the session depends on it.

```
scripts/serve [--dojo <root>] [--port 3119] [--idle-timeout 900] &
```

Binds `0.0.0.0` (reachable over SSH/tailscale), exits after 15 min with no request, so a forgotten
server reaps itself. Tell the learner a *reachable* URL: `tailscale ip -4` if present, else
`hostname -I`; `localhost` only if they are on this machine.

Free the port first **by port, never by pattern** — `lsof -ti :3119 | xargs -r kill`. A
`pkill -f "…--port 3119"` matches your own shell.

## What the page is

One lesson document with a course sidebar — not a stack of cards. The sidebar shows the whole
course every day: the ladder with each rung's state, the capstone and its brick count, what is due in
the sharpen tracks, attendance. The document reads top to bottom in the order the day happens:
last night's lesson (outcomes · the concept · go deeper), then the box (drill · check yourself · kata ·
explain back · log), then tomorrow. Sections before the open phase collapse to a strip with their
result; sections after it are dimmed with just their heading; any of them can be reopened.

The same page, opened in the evening after Log, shows tomorrow's lesson in full with the clock
stopped. That is the prep: reading it there, on a phone via the tailscale URL, or from
`lessons/<track>/<slug>.md` in any editor all count the same. Nothing asks whether it was read; the
quiz at tomorrow's open is the only check.

## What owns what

| surface | owns |
|---|---|
| the page | the lesson; anything the learner commits to *before* seeing the answer; the diff; done-when; the run and probe commands; check output; the clock |
| the editor | code. Always. |
| the terminal | dialogue — Socratic answers, the hint ladder, one question per turn |

## Endpoints

| endpoint | does |
|---|---|
| `GET /` | `assets/page.html`, static, never regenerated |
| `GET /state` | `.dojo/page.json` verbatim; the page polls every 2s and redraws on a `v` bump |
| `GET /lesson` | the markdown file named by `state.lesson`; must live under `<dojo>/lessons/` |
| `GET /events` | this session's committed actions, so a refresh loses nothing |
| `POST /commit` | appends one learner action to `.dojo/page-events.jsonl` |
| `POST /file` | writes **one** path listed in `state.writable` — every other path is refused |
| `POST /check` | runs exactly `<kata_dir>/check`, no arguments |

`/check` takes no parameters, `/lesson` and `/file` choose no path of their own; all targets come
from `page.json`, which only you write. That is the entire surface of the `0.0.0.0` bind.

## page.json — you write it, the page renders it

**Bump `v` on every write.** Write state, never markup: regenerating the page per phase is ~80%
token waste (measured in canvas) and there is no shell to regenerate anyway. Write it at Open with
`course` and today's cards; rewrite it at Log with `phase: "tomorrow"`, `outside_box: true` and
`lesson` pointing at tomorrow's file.

```json
{ "v": 7, "date": "2026-09-04", "track": "nest", "concept": "first-route-and-its-inputs",
  "session_no": 5,
  "started_at": "2026-09-04T06:12:00Z", "session_minutes": 20,
  "phase": "kata",                       // the id of the section that is open
  "outside_box": false,                  // true after Log: stops the clock, opens the lesson in full
  "kata_dir": "katas/2026-09-04-nest-first-route-and-its-inputs-echo",
  "writable": [],                        // prose only — see the hard rules
  "eyebrow": "Rung 1 of 20 · nest · brick 1 of tiny-flag · second attempt, full width",
  "headline": "A route that answers, and where its inputs come from",
  "lede": "Yesterday's two handlers were right in shape and red on a missing import. Today the same rung at full width, inside the real tiny-flag app.",
  "lesson": "lessons/nest/first-route-and-its-inputs.md",   // rendered above the box; null on sharpen-only days
  "lesson_read_by": "read the night before · ~10 min",
  "course": {
    "dojo": "nest-dojo", "learner": "Johan",
    "summary": "learning Nest · sharpening TypeScript, React, systems design",
    "ladder": [ {"n": 1, "name": "a route that answers…", "state": "introduced", "today": true},
                {"n": 2, "name": "proving a TypeScript type…", "state": "unseen"} ],
    "ladder_note": "+ 13 more · Postgres at 15 · tests at 19–20",   // when you truncate the list
    "capstone": {"name": "tiny-flag", "brief": "a feature-flag switch panel driven by a CLI and by agents",
                 "brick": 1, "of": 19, "path": "capstone/tiny-flag", "running": true, "url": "http://100.x.y.z:3000"},
    "sharpen": [ {"track": "typescript", "due": 3}, {"track": "react", "due": 2} ],
    "attendance": {"days": 4, "of": 7, "over": 4, "sessions": 4}
  },
  "cards": [ … ] }
```

Cards carry `{id, kind, name, sub, budget, side}` plus their own fields. `side` is `"in"` for a
section inside the box, `"after"` for the log's tomorrow card; the lesson sections are rendered by
the page from the markdown and need no card.

| kind | fields |
|---|---|
| `choice` | `stem?` `code?` `q` `opts:[{l,t}]` `right` `why` (HTML) `near?` `hit_label?` `near_label?` — the drill |
| `quiz` | `items:[{q, code?, opts:[{l,t}], right, why}]` (3) `gate` (one sentence: what the score does to the kata) `no_gate?` (true when no lesson was assigned: the page says so and the score cannot narrow) |
| `kata` | `goal` `concept` `done_when` `files:[]` `code?` `constraints:[]` `narrowed?` (HTML) `run?:{cmd, where, note}` `probe?:{cmd, expect}` `hints?:["a pointer","a shape","show me"]` `hints_used?` |
| `review` | `title` `diff` (raw) `verdict:[…]` — writes `writable[0]` on every pause |
| `explain` | `q` `reveal:{verdict,body}` `solutions:[{k,code}]` |
| `log` | `lines:[{label,text}]` `diff` (HTML) `logline` `commit` |
| `tomorrow` | `for` `why` `lesson` (path, or null) `note` (one line when there is no lesson) |

`why`, `narrowed`, `reveal.body`, `log.diff` and the quiz's `why` are inserted as HTML — everything
else is escaped. Write plain prose with at most `<code>`/`<em>`/`<b>`; never interpolate learner
input. The lesson markdown is rendered by the page with a small renderer: headings, paragraphs,
lists, fenced code, inline code, bold, italics, links, blockquotes. Nothing else; keep the file to
those.

## page-events.jsonl — the page writes it, you read it at Log

One JSON object per line, each with `kind` and a UTC `at`. Ephemeral, gitignored.

```
{"kind":"choice","card":"drill","pick":"d","hit":true,"at":"…"}
{"kind":"quiz","card":"quiz","item":1,"pick":"b","hit":true,"at":"…"}
{"kind":"check","rc":1,"at":"…"}
{"kind":"confidence","card":"explain","value":4,"at":"…"}
{"kind":"explain-text","card":"explain","text":"…","at":"…"}
{"kind":"label","card":"explain","which":"A","value":"readable","at":"…"}
{"kind":"review-state","card":"review","verdict":"request changes","comments":[…],"at":"…"}
{"kind":"lesson-open","at":"…"}          // the lesson was opened on the page outside the box; informational only
```

**Read this file in the Log phase and take the measured fields from it** — `drill.hit`, `quiz`
(count `quiz` lines with `hit:true`, over 3), `check_runs` (count the `check` lines), `confidence`.
Do not ask the learner to remember at minute 19 what they clicked at minute 2. `lesson-open` is
never a measure of prep; the quiz is.

## The quiz is the entry ticket

The `quiz` card is the check on whether last night's lesson happened. Nothing asks the learner to
tick a box; self-reported prep is worthless.

- **2 or 3 of 3** → normal session, full-width kata.
- **0 or 1 of 3** → cold start. Watch `page-events.jsonl` after the third pick and rewrite
  `page.json`: the kata card you scaffold is the narrow one — one rule instead of several, one
  worked example given, fewer tests — with `narrowed` set to one sentence saying so. Then
  `references/rules.md` applies: **a narrowed kata cannot promote a concept.**
- **`no_gate`** → the score is logged and changes nothing. Set it whenever no lesson was assigned
  for today.

The page never decides this. It shows what `page.json` says, so the branch stays in the rule tables
where every other state change lives.

## The kata card on a capstone brick

`files` names the file(s) holding the `TODO(human)`; the page shows them as paths to open, never as
editable text. `run` is the dev-server command and where to run it (you started it at setup; the
card says so and shows where its log is). `probe` is one curl the learner can paste to see the brick
answer by hand — expected result beside it. The check button still runs `<kata_dir>/check`, which
runs the brick's spec through the capstone's own runner.

## Review katas

The page computes gutter line numbers from the hunk headers, so the learner never counts `+` lines.
Comments are anchored by click and carry What / Why / Instead; the page writes `writable[0]` on
every pause, which means at the wall whatever is written is already on disk.

A review kata's `check` can therefore assert two things a hand-written file could not:

- every comment block has all three of What, Why and Instead;
- every anchor names a file and line that exist in the diff (a comment on a line that is not in the
  change is a false positive, and false positives are on the rubric).

## Hard rules this surface adds

1. **The browser is an editor, not the agent.** A write through `POST /file` carries the learner's
   authorship, exactly as their editor saving the file does. You still may not write into the kata
   dir or the capstone after `kata(setup)`; the audit is unchanged — `scripts/context` prints commit
   authorship.
2. **The page never owns code.** `writable` may name only prose the learner authors (`REVIEW.md`, a
   design one-pager). Never a source file. During a code kata the compiler is the teacher.
3. **A narrowed kata cannot promote a concept.** See the transition table in `references/rules.md`.
4. **The lesson is read, never pushed.** No timer, no "mark as read", no reminder. The page shows it;
   the quiz measures it.
