# Doc Layout & Conventions

The planning space is namespaced under `docs/better-planning/` so it never clashes with an
existing repo's documentation. Everything the process produces lives here (one exception: the
glossary may be promoted to repo root — see below).

## The tree

```
docs/better-planning/
  README.md                       ← the map: layout, conventions, status index. Maintain it.
  GLOSSARY.md                     ← living vocabulary (see SKILL.md → Vocabulary discipline)
  research/
    <topic>-findings.md           ← evidence: experiments, prior art, user research, POC results
  product/
    <product>-prd.md              ← the high-level PRD (one per product)
    <product>-prd-overview.html   ← its visual companion
    features/
      <feature>/                  ← ALL of a feature's artifacts together
        <feature>-prd.md
        <feature>-prd-overview.html
        <feature>-plan.md
        <feature>-plan-overview.html
  archive/
    <superseded-doc>.md           ← retired docs move here; never delete planning history
```

Why group by feature, not by document type: the real access pattern is "everything about
feature X", not "all the plans". One directory is one feature's full paper trail, `git log` on
the directory is the feature's history, and new artifact types (decision notes, schema sketches)
land in the directory without inventing new conventions.

## Naming rules

- Kebab-case, **stem-named** after the feature/product (`harness-prd.md`, not `prd.md`) so a
  file is identifiable out of context (editor tabs, search results, diffs).
- Companions: `<doc-stem>-overview.html`, always next to their doc.
- Signpost files (README, GLOSSARY) are UPPERCASE/standard-case; content docs are lowercase.
- A signpost lives at the root of the scope it governs: the planning README at
  `docs/better-planning/`, and the glossary promoted to repo root only when its terms govern
  code, not just docs.

## Document headers

Every doc opens with a status block — this is what lets a fresh session resume without
re-litigating:

```markdown
**Status:** draft | in-review | settled | superseded — with date.
**Depends on:** <upstream doc + sections>
**Draws on:** <research/evidence docs>
**Companion:** <stem>-overview.html
**Supersedes:** <doc> (if any — move the old one to archive/)
```

## Per-layer content guides

**Research / findings** (`research/`): what was *learned*, not what is decided. State scope of
confidence explicitly ("this validates X, NOT Y"). End with an "open tensions/decisions"
section — the downstream PRD must resolve every item on it, with traceability.

**High-level PRD** (`product/<product>-prd.md`): vision, problem, design principles, the shape
of the whole (architecture at one diagram's depth), per-feature one-paragraph summaries, scope
cuts (what's deliberately out and *why*), roadmap by risk/proof order, an index of implied
feature PRDs, and a **resolved-decisions table** tracing every open item from research to its
resolution. Stays high-level: any topic needing schemas or contracts defers to a feature PRD by
name.

**Feature PRD** (`features/<feature>/<feature>-prd.md`): the what and why in depth. A feature
PRD is complete only when it has ALL of these sections — check before calling a draft done:

- [ ] requirements / behavior, in depth
- [ ] the contracts/schemas other features consume (flagged at the top if others depend on them)
- [ ] acceptance criteria — testable, numbered
- [ ] **edge cases** — a dedicated section, not semantics scattered through prose. Edge cases
      are where ambiguity hides; a PRD without them reads agreed-upon and ships surprises.
- [ ] deliberately deferred items, with reasons
- [ ] decisions table for calls made at this level (user-made calls distinguished from
      draft-level calls awaiting review)

**Implementation plan** (`features/<feature>/<feature>-plan.md`): the how — build steps in
order, milestones with verifiable outcomes, file/module breakdown, test plan, sequencing and
dependencies. A good plan lets someone start coding within minutes of reading it.

## Conventions that keep the space healthy

- **One concern per doc; link, don't duplicate.** Duplicated facts drift apart silently.
- **Status index in the README** — one row per doc with its status. Update it in the same
  commit as any doc status change; the index *is* the resume point for future sessions.
- **Archive, never delete.** Superseded docs are part of the decision record.
- **Decision traceability.** Every "open question" raised anywhere must eventually appear in
  some doc's decisions table as resolved or deliberately deferred. Nothing resolves silently.
- **Claim only what's validated.** Mark inference vs. evidence honestly; a PRD that overstates
  certainty poisons every doc below it.
