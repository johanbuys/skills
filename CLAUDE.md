# CLAUDE.md

Guidance for working in this skills repo.

## Authoring `SKILL.md` frontmatter

The `skills` CLI (`npx skills`) parses each skill's frontmatter with a real YAML
parser. If the YAML fails to parse, or `name`/`description` come out missing or
non-string, the skill is **skipped** by both `skills list` and `skills add`. As of
CLI 1.5.22 this prints a one-line `⚠ Skipped <path>` warning — easy to scroll past
in a long install, so a frontmatter mistake still tends to look like "the CLI isn't
picking up my skill." (Older versions dropped it with no message at all.)

**Always quote the `description` value in double quotes**, escaping any internal
`"` as `\"`:

```yaml
---
name: my-skill
description: "One line. Mentions \"quoted phrases\" safely; colons: fine when quoted."
---
```

Why this matters — the things that silently break an *unquoted* description:

- **`: ` (colon followed by a space)** inside the value. YAML reads it as a nested
  mapping key and the whole frontmatter block fails to parse. This is the one that
  bit us — `better-planning-comprehend` and `better-planning-design` were dropped
  for exactly this reason. Quoting neutralizes it; prefer ` — ` (em dash) over a
  bare colon in prose anyway.
- Leading special characters, ` #`, and other YAML indicators.

Quoting the value defensively avoids all of these. After editing frontmatter,
verify with `npx skills list` — every skill directory with a `SKILL.md` should
appear. A directory with no `SKILL.md` (e.g. `skills/better-planning-workspace/`)
is intentionally skipped.

The CLI's hard limit on `description` length is 1024 characters (only enforced for
the remote registry index, not local skills, but stay under it regardless).

Keep `name` identical to the skill's directory name. The Agent Skills spec requires
it; the CLI does not enforce it, but nothing is gained by diverging. Names are
lowercase `a-z0-9-`, max 64 chars, no leading/trailing hyphen and no consecutive
hyphens (`--`) — watch that last one when composing a family prefix.

## Layout: flat only, group by name prefix

Every skill lives at `skills/<name>/SKILL.md` — **one level, no category
directories**. Grouping is expressed by a shared prefix in the skill name plus a
table in `README.md`, never by a directory tree.

Current groups:

| Prefix | Meaning |
|---|---|
| `work-*` | the live workflow layer (`work-start`, `work-discover`, `work-implement`) |
| `better-planning-*` | frozen; kept for history, not maintained |
| _(none)_ | standalone tools — `canvas`, `study` |

Nesting into `skills/<category>/<name>/` does parse — the CLI walks container
directories three levels deep — so this is a convention you have to hold, not one
the tooling enforces. Four reasons to hold it:

- **The registry never sees the path.** A skill's identity is its `name`
  frontmatter. The install target is `.claude/skills/<name>`, and the skills.sh id
  is `<owner>/<repo>/<name>`. Vercel's own `skills/react-best-practices/` publishes
  as `vercel-react-best-practices`. Categorized repos render on skills.sh as one
  flat alphabetical list — the taxonomy is invisible to everyone installing it.
- **Directories give no collision relief.** `name` must be unique across the whole
  repo regardless of folder. Two skills declaring the same `name` in different
  category directories do not coexist — one is dropped with no warning at all.
- **`evals/run.mjs` assumes one level** (`SKILLS_DIR = skills/`, scanned one deep).
  Nesting breaks the runner and the 1:1 join between `skills/<name>/` and its
  fixtures.
- **`npx skills add johanbuys/skills/skills/<category>` is a trap.** It looks like
  "install that group" but only walks one level below the path it is given, so a
  sub-nested category returns a partial set silently.

A subdirectory *inside* a skill (`assets/`, `references/`, `scripts/`, `evals/`) is
fine and expected — the walker stops descending as soon as it finds a `SKILL.md`,
so a skill's own files can never be mistaken for sibling skills.
