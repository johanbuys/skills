# taskpilot

A minimal personal task manager CLI. Add tasks, list them, mark done.

```
npm install -g .    # installs the `tp` command
tp add Water the plants
tp list
tp done 1
```

All state lives in a single JSON file at `~/.taskpilot.json` (override with the
`TASKPILOT_DB` env var). No daemon, no account, no sync — it's a file.

Roadmap notes live in `docs/plans/old-roadmap.md`.
