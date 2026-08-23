# skills

Agent skills by [@johanbuys](https://github.com/johanbuys), following the
[Agent Skills](https://github.com/vercel-labs/skills) conventions.

## Install

```bash
npx skills add johanbuys/skills
```

Or a single skill:

```bash
npx skills add johanbuys/skills --skill work-discover
```

## The work family

Three slash-command skills over a four-file memory model. One objective: shared
understanding between human and agent, **demonstrated, never asserted** — the bar
for alignment is "the human experienced a prototype or slice and reacted", not
"the human approved a document". A session that produced only conversation
produced nothing; every session leaves a durable artifact and an honest handoff
entry.

| Skill | When | What it does |
|---|---|---|
| [`work-start`](skills/work-start/SKILL.md) | session start | Reads the memory files, finds where inflight work stands, names **one** next move — not a menu. Biased to resume inflight work before starting new work. |
| [`work-discover`](skills/work-discover/SKILL.md) | an idea, feature, or PRD needs shared understanding | Prototypes and slices the human reacts to, folded into a plan in plain words. Three exits, all legitimate: a plan (do it now), an issue (real, but later), or a recorded no. |
| [`work-prototype`](skills/work-prototype/SKILL.md) | a question should be settled by experiencing something | The dispatch wrapper around a throwaway prototype: a builder subagent constructs it (following the vendored `prototype` rules) while the main session stays in the conversation. Announces what it will build before building; hands over something the human can open or run, never narrated terminal output. The one family member the model may invoke itself — discover routes through it. |
| [`work-implement`](skills/work-implement/SKILL.md) | a plan exists | A subagent-driven loop where the controller never writes code: validation contract first, fresh implementers per task, a review gate after every task, a capped fix loop with model escalation, `progress.txt` as the crash-proof ledger, one ship-gate review, purge-and-promote at ship. |

There is deliberately no `/wrap` skill — every skill carries the same closing
contract: open the work's `handoff.md` section when work starts and keep it
updated as things move (sessions end without warning, so "write it at the end"
is how entries don't get written): what moved, what's next, and the
**verdict** — what was actually observed running, or "none". An entry is one
line (~30 words) that rides a work commit — overflow names an artifact, prior
entries are never rewritten, and bookkeeping never ships as its own commit
chain.

### The memory model

Each file has one job and one lifespan, and each is created lazily by the skill
that first writes it — there is no setup step and no scaffolding. The permanent
files grow only through the **purge-and-promotion** pass when work ships, plus
glossary entries the moment a term earns one — nobody curates them as a chore.

| File | Lifespan | Holds |
|---|---|---|
| `progress.txt` | one implementation loop | Validation contract, task checklist, breadcrumbs. Committed on the work branch; deleted in the final commit before merge. |
| `plans/<slug>.md` | one piece of work | The `work-discover` deliverable, run by `work-implement`. Disposable — deleted at ship. |
| `handoff.md` | tracks inflight work | One `## <slug>` section per piece of work, dated entries of *what moved · what's next · verdict*. Sections are deleted when their work ships. |
| `CONTEXT.md` + `docs/adr/` | permanent, curated | Shared language and only non-discoverable truths; decisions and their why. `CONTEXT.md` carries the glossary role — a term earns an entry the moment a human and an agent turn out to mean different things by it. ADRs follow [`adr-template.md`](skills/work-discover/adr-template.md), numbered `docs/adr/NNNN-slug.md` and superseded rather than amended. |
| `CONSTITUTION.md` (optional) | permanent, amended deliberately | Binding engineering principles, each with its why — forward-looking law, not history (history is ADRs). A plan that conflicts with a MUST principle is a blocking finding: change the plan or amend the law, never ignore it. The skills respect it when present and may propose founding or amending it, but only the human legislates; no amendment log — git holds that. |

The family leans on skills vendored from
[mattpocock/skills](https://github.com/mattpocock/skills) rather than reinventing
them — `prototype`, `tdd`, `wait-what`, `handoff` (conversation compaction — a
different thing from `handoff.md`):

```bash
npx skills add mattpocock/skills
```

Install them once at the **global** scope and every repo on the machine has
them. The work skills degrade gracefully when a vendored skill is missing —
each carries the essence of what it borrows — but they're better with the real
thing installed.

## Standalone skills

Usable on their own, not part of any family.

| Skill | What |
|---|---|
| [`canvas`](skills/canvas/SKILL.md) | A served-HTML interactive surface for agents: present anything as a page with per-section comment boxes, and run a live loop where a browser submit wakes the agent and reloads the page. Works over SSH/tailnet where `file://` can't. Also draws the diagrams: Mermaid source rendered to publication-quality SVG — any family — with a legend that toggles parts of the picture on and off. Several skills sit on it; also useful on its own. |
| [`study`](skills/study/SKILL.md) | A personal, cross-project learning queue + tutor. Capture topics worth understanding into a dumb home-dir backlog (`~/.study/topics.md`) from anywhere, then run a guided, canvas-driven, recall-checked deep dive on any one — grounded in your real code, a scaffolded sandbox, or purely conceptual. |

## The better-planning family (frozen)

Kept for history, not maintained. Nine skills (brainstorm → prd → design → plan →
tasks, plus build/sync/comprehend companions and a shared workspace) that took a
fuzzy idea to buildable work through a chain of durable documents. It died of
ceremony — statuses, slice graphs, routing tables — and the three ideas that
earned their keep (shared language, handoff as memory, the artifact mindset) live
on in the work family above. The skills remain installable as-is under
`skills/better-planning-*`; see git history for their story.

## License

[MIT](LICENSE)
