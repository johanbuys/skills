---
name: orient
description: "Cold-start orientation for any project — answer \"where are we and what's next?\" with evidence, then recommend the highest-leverage next move. Reads the planning space's status index and handoff/progress docs when they exist, recent git history, working-tree state, and the tracker (open PRs, review states, issues, milestone progress), and digests them into: what this project is, where each piece of work stands, what's in flight, what's blocked, and one concrete recommended next move with alternates — each routed to the skill that picks it up. Use it at the start of any session on an existing project and whenever the user asks for state or direction — \"catch up to where we are\", \"what's next?\", \"where are we with this project?\", \"what state is this in, what can it do, what's lacking?\", \"I merged the PR, what now?\", \"explore the codebase so we can figure out where to go next\", \"get this into a workable state\"."
---

# Orient

Every session on an existing project starts with the same question — *where are we, and what
should happen next?* — and answering it by hand means re-reading docs, scrolling git log, and
clicking through PRs while the human waits. This skill makes that a single motion: gather the
state, digest it, and land on a recommendation. It's read-only on purpose; orientation that
starts changing things isn't orientation.

The deliverable is not a status dump. It's a **decision-ready picture**: short enough to read in
one sitting, honest about what's evidence vs. inference, ending in a move.

## Gather — all sources, in parallel

Fan out subagents for anything heavy (a big repo, a long history); collect:

- **The project's own state records, first.** `docs/better-planning/README.md`'s status index if
  the planning space exists — it's the router: which feature is at which phase, what's settled,
  where the last sync left off. Also any handoff notes, `progress.*` files, TODO docs, and
  `CLAUDE.md` for what the project *is*. Projects that keep these records exist precisely so a
  fresh session doesn't re-derive state — read them before deriving anything.
- **Git**: current branch and its relation to main (ahead/behind), dirty tree, stashes, recent
  log (since the last session or last merge — enough to see the arc, not the noise), branches
  that look abandoned.
- **The tracker** (when `gh` and a remote exist): open PRs with their review/CI state, open
  issues grouped by label/milestone, the current milestone's progress bar.
- **The code**, last and lightly: only enough to sanity-check what the docs claim ("harness is
  built" — does `src/cli.ts` exist and run?). Deep code understanding is a different job (see
  boundaries, below).

Flag contradictions between the records and reality plainly — a status index that says
"in-progress" for something whose PR merged last week is itself a finding.

## Digest — the one-screen answer

Present in this order, and keep it to one screen before the human asks for more:

1. **What this is** — one sentence, for re-entry after time away.
2. **Where things stand** — per feature/workstream: phase, last landed thing, what's in flight
   (open PRs and their state), what's blocked and on what.
3. **What changed recently** — the few moves that matter since the human last looked, not a
   commit list.
4. **Hygiene worth knowing** — dirty tree, stale branches, unmerged-but-approved PRs, issues
   that look done but are open. Small, but this is exactly what "get me to a workable state"
   means.

## The move — recommend, don't enumerate

End with **the highest-leverage next move** — one concrete recommendation with the reasoning,
then one or two live alternates a sentence each. "Here are nine options" is not orientation;
having read everything, you have an opinion — give it, and let the human overrule.

Route the move to whatever picks it up: next milestone's tasks → better-planning-tasks; a landed
milestone not yet reconciled → better-planning-sync; an open PR with findings → pr-shepherd; a
fuzzy new direction → better-planning-brainstorm; "I don't understand this system anymore" →
better-planning-comprehend. If none of those are installed, just say what the move is — the
routing is a convenience, not the point.

## Boundaries

- **Read-only.** It may *recommend* cleanup (prune branches, close stale issues) but performs
  nothing — the session that follows does, with the human's go.
- **Work state, not system internals.** "What's next" is this skill; "how does the scheduler
  actually work" is comprehension (better-planning-comprehend, when installed) — offer the
  handoff instead of half-doing it.
- **Evidence over vibes.** Every claim in the digest traces to a source (index row, PR state,
  commit); anything inferred is marked as inference.
