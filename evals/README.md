# Evals

Each skill ships `skills/<skill>/evals/evals.json` — test cases describing how the skill should
behave. They're graded in **two layers**, because two different things are being checked:

| Layer | What | How it's graded | Automated? |
|---|---|---|---|
| **Structural** | The eval files are well-formed and their fixtures exist | `node evals/run.mjs validate` | ✅ deterministic, CI-able |
| **Behavioral** | The skill actually does what `expected_output` / `assertions` describe | run the skill against the prepared fixture, then judge the prose assertions | ⚠️ needs an agent / LLM judge |

The prose assertions (e.g. *"teaches layered-zoom"*, *"cites sources"*) can't be graded by a shell
script — that's a judgment call. So the runner fully automates the structural layer and **prepares +
drives** the behavioral layer; the actual grading is done by an agent (or the external skills
tooling).

## Commands

```bash
node evals/run.mjs                       # validate (default)
node evals/run.mjs validate              # structural check; exits non-zero on errors
node evals/run.mjs list                  # list every eval and its fixture
node evals/run.mjs prepare <skill> <id|name> [destDir]
```

`validate` **errors** (fail the run) on: invalid JSON, a missing required field
(`id`/`name`/`prompt`/`expected_output`/`assertions`), a duplicate id, or a declared `fixture` that
doesn't exist. It **warns** (doesn't fail) on: an eval with no `fixture` yet (behavioral run not
wired), or `skill_name` not matching the directory.

## The eval schema

```jsonc
{
  "skill_name": "study",
  "evals": [
    {
      "id": 0,
      "name": "capture-only-no-teaching",
      "fixture": "fixtures/study/empty-home",   // optional: dir to materialize (authoritative)
      "fixture_kind": "home",                    // "home" (set HOME=) or "cwd" (run in dir)
      "prompt": "Add 'X' to my study list ...",  // what the user says
      "expected_output": "Appends one line ...", // prose: what correct behavior looks like
      "files": ["fixtures/home — ..."],          // optional human-readable context
      "assertions": ["appends-one-line: ...", "..."]  // prose checks an agent/judge verifies
    }
  ]
}
```

`fixture` is the machine-usable field the runner reads; `files` is free prose for humans.

## Fixtures

Fixture worlds live under `fixtures/`. Two kinds:

- **`home`** — a fake home directory (e.g. `fixtures/study/queued-home/` containing `.study/`).
  `prepare` copies it to a temp dir and tells you to run the skill with `HOME=<dir>`, so paths like
  `~/.study/topics.md` resolve inside the fixture.
- **`cwd`** — a sample repo (e.g. `fixtures/study/auth-repo/`). `prepare` copies it and tells you to
  run the skill with that as the working directory.

`prepare` never mutates the checked-in fixture — it copies to a throwaway temp dir first.

Two conventions for `cwd` fixtures:

- **No `.git` ships with a fixture** (git can't track a nested repo). When an eval's prompt or
  assertions assume git state — "empty git repo", "git status clean" — the driver should
  `git init && git add -A && git commit -q -m fixture` in the materialized copy before running
  the skill.
- **The `fixtures/taskpilot/` snapshots are a timeline**, not independent worlds: progressive
  states of one project moving through the family
  (`legacy-docs` → `prd-settled` → `prd-in-review` → the future Tier-3 built-code snapshots).
  Each later snapshot is a byte-consistent evolution of the earlier one — same app code, same
  untouched legacy roadmap, more planning artifacts. Edit them as a set: a change to the app or
  a shared doc in one snapshot must be replayed into the later ones. Details in
  `fixtures/taskpilot/README.md` (the per-project READMEs at `fixtures/<project>/README.md` sit
  *above* the copied snapshot dirs, so the materialized worlds carry no eval-harness markers).

## Driving a behavioral run

```bash
node evals/run.mjs prepare study graduate-line-and-scaffold-on-learn
# → materializes the fixture, prints the prompt + the assertions to judge
```

Then have an agent run the named skill against the printed prompt in the materialized directory, and
judge each assertion against what the skill did. Skills without a `fixture` yet are still validated
structurally; add a fixture + `fixture`/`fixture_kind` fields to wire them for behavioral runs.
