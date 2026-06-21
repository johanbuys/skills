# CLAUDE.md

Guidance for working in this skills repo.

## Authoring `SKILL.md` frontmatter

The `skills` CLI (`npx skills`) parses each skill's frontmatter with a real YAML
parser. If the YAML fails to parse, the parser returns an empty object, the skill
ends up with no `name`/`description`, and it is **silently dropped** from both
`skills list` and `skills add` — no error is shown. So a frontmatter mistake looks
like "the CLI isn't picking up my skill."

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
