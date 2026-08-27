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

## What owns what

| surface | owns |
|---|---|
| the page | anything the learner commits to *before* seeing the answer; the diff; done-when; check output; the clock |
| the editor | code. Always. |
| the terminal | dialogue — Socratic answers, the hint ladder, one question per turn |

## Endpoints

| endpoint | does |
|---|---|
| `GET /` | `assets/page.html`, static, never regenerated |
| `GET /state` | `.dojo/page.json` verbatim; the page polls every 2s and redraws on a `v` bump |
| `GET /events` | this session's committed actions, so a refresh loses nothing |
| `POST /commit` | appends one learner action to `.dojo/page-events.jsonl` |
| `POST /file` | writes **one** path listed in `state.writable` — every other path is refused |
| `POST /check` | runs exactly `<kata_dir>/check`, no arguments |

`/check` takes no parameters and `/file` chooses no path of its own; both targets come from
`page.json`, which only you write. That is the entire surface of the `0.0.0.0` bind.

## page.json — you write it, the page renders it

**Bump `v` on every write.** Write state, never markup: regenerating the page per phase is ~80%
token waste (measured in canvas) and there is no shell to regenerate anyway.

```json
{ "v": 7, "date": "2026-08-28", "track": "nestjs", "concept": "dto-pipes",
  "started_at": "2026-08-28T06:12:00Z", "session_minutes": 20,
  "phase": "kata",                       // the id of the card that is open
  "outside_box": false,                  // true for the prep card: stops the clock
  "kata_dir": "katas/2026-08-28-nestjs-dto-pipes-reject-bad-bookmark",
  "writable": [],                        // prose only — see the hard rules
  "headline": "DTOs and validation pipes — a POST returns 400 on a bad body",
  "why": "first unlocked ladder item; settles an open flag",
  "yesterday": "Pipes docs · one course section · ~10 min",
  "cards": [ … ] }
```

Cards carry `{id, kind, name, sub, budget}` plus their own fields. Finished cards (those before
`phase`) collapse to a strip showing their result; the learner can reopen any of them.

| kind | fields |
|---|---|
| `choice` | `stem?` `code?` `q` `opts:[{l,t}]` `right` `why` (HTML) `near?` `hit_label?` `near_label?` |
| `lesson` | `insight` (HTML) `code?` `docs:[{label,url}]` `predict:{q,opts,right,why,cold:{note,code}}` |
| `kata` | `goal` `concept` `done_when` `path` `code` `constraints:[]` `narrowed?` (HTML; set when the kata is the cold-start version) |
| `review` | `title` `diff` (raw) `verdict:[…]` — writes `writable[0]` on every pause |
| `explain` | `q` `reveal:{verdict,body}` `solutions:[{k,code}]` |
| `log` | `lines:[{label,text}]` `diff` (HTML) `logline` `commit` |
| `prep` | `for` `why` `budget_text` `rows:[{kind,title,desc,url,min}]` |

`why`, `insight`, `narrowed`, `reveal.body` and `log.diff` are inserted as HTML — everything else is
escaped. Write plain prose with at most `<code>`/`<em>`/`<b>`; never interpolate learner input.

## page-events.jsonl — the page writes it, you read it at Log

One JSON object per line, each with `kind` and a UTC `at`. Ephemeral, gitignored.

```
{"kind":"choice","card":"drill","pick":"d","hit":true,"at":"…"}
{"kind":"predict","card":"lesson","pick":"b","hit":true,"at":"…"}
{"kind":"check","rc":1,"at":"…"}
{"kind":"confidence","card":"explain","value":4,"at":"…"}
{"kind":"explain-text","card":"explain","text":"…","at":"…"}
{"kind":"label","card":"explain","which":"A","value":"readable","at":"…"}
{"kind":"review-state","card":"review","verdict":"request changes","comments":[…],"at":"…"}
```

**Read this file in the Log phase and take the measured fields from it** — `drill.hit`,
`predict_hit`, `check_runs` (count the `check` lines), `confidence`. Do not ask the learner to
remember at minute 19 what they clicked at minute 2.

## The predict question is the entry ticket

A `lesson` card's `predict` is the check on whether last night's prep happened. Nothing asks the
learner to tick a box; self-reported prep is worthless.

- **hit** → normal session, full-width kata.
- **miss** → cold start. Watch `page-events.jsonl`, and rewrite `page.json`: the lesson card gets
  its `predict.cold` block, and the kata card you scaffold is the narrow one — one rule instead of
  several, one worked example given, fewer tests — with `narrowed` set to one sentence saying so.
  Then `references/rules.md` applies: **a narrowed kata cannot promote a concept.**

The page never decides this. It shows what `page.json` says, so the branch stays in the rule tables
where every other state change lives.

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
   dir after `kata(setup)`; the audit is unchanged — `scripts/context` prints commit authorship.
2. **The page never owns code.** `writable` may name only prose the learner authors (`REVIEW.md`, a
   design one-pager). Never a source file. During a code kata the compiler is the teacher.
3. **A narrowed kata cannot promote a concept.** See the transition table in `references/rules.md`.
