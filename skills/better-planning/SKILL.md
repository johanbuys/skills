---
name: better-planning
description: Collaborative product/feature planning that turns a fuzzy idea into an unambiguous, layered spec — research → high-level PRD → feature PRDs → implementation plans — under docs/better-planning/, with self-contained HTML visual companions for review, a living glossary, and one-decision-at-a-time brainstorming. Use this whenever the user wants to plan, spec, scope, or rethink a product or feature — "let's plan X", "spec this out", "write a PRD", "think through this feature", "we need a design doc", "what should we build" — even if they don't say "PRD" or "plan". Also use it whenever a repo contains docs/better-planning/ and the user wants to continue, review, or build on that planning work.
---

# Better Planning

Planning between a human and an agent fails in two ways: **ambiguity** (both sides think they
agree, but each holds a different picture) and **overwhelm** (walls of questions, twenty-section
documents nobody confirmed). This process attacks both. Shared, reviewable artifacts at every
step kill ambiguity; one decision at a time kills overwhelm. The agent brings analysis and a
recommendation; the human makes the call; every call is written down where the next session —
human or agent — can find it.

The output is a layered documentation space the project keeps forever:

```
research (evidence) → high-level PRD (the product) → feature PRDs (the what/why, per feature)
                                                   → implementation plans (the how, per feature)
```

Each layer stays at its own altitude and defers depth downward. Every PRD ships with a
self-contained HTML companion the human reviews visually instead of reading raw markdown.

## Stage 0 — Detect state

Before anything else, look at what exists:

- **`docs/better-planning/` exists** → this process has run here before. Read its `README.md`
  (the map + status index) and the relevant doc headers, then resume from wherever the index
  says things stand. Don't re-ask settled decisions — they're in the docs' decision tables.
- **Other planning docs exist** (`docs/prd/`, `plans/`, `rfcs/`, ADRs, a wiki export…) → read
  them as orientation material, then ask the user **one** question: keep planning in their
  existing structure, adopt this layout fresh (linking to the old docs as research/archive), or
  run both side by side. The `docs/better-planning/` namespace never clashes with anything, so
  coexistence is always safe. Never move or rewrite documents you didn't create without being
  asked.
- **Greenfield** → you'll create the space at the first draft (not before — see Stage 1).

## Stage 1 — Orient: read first, digest back, ask nothing

Read everything relevant before asking the user anything: existing docs, research notes, the
code, recent git history, linked issues. Then present a **digest** — "here's what was planned,
here's what we know, here's what changed since" — so both sides start from the same base. A good
digest is compact, organized by what matters (not by file), and honest about what's evidence vs.
inference.

Resist the urge to ask questions during orientation. Questions before shared context produce
answers that get re-litigated later. The digest *ends* by naming the first real fork (Stage 2).

## Stage 2 — Frame: the fork-level questions

Identify the few questions that shape everything else — product identity, who it's for, what the
core bet is, what's deliberately out. Bring them up **conversationally, one per exchange**, each
as: context → options with honest trade-offs → your recommendation → the ask. Never present a
form or a battery of questions; pick the question whose answer most constrains the rest, and let
its answer reshape the next one.

Rules that make this work (they apply to every stage, not just framing):

- **Analysis + recommendation, user decides.** Always land on a recommendation and say why.
  "Here are three options" without a lean offloads the thinking back onto the human.
- **Challenge premises honestly — including your own.** If the user pokes at something you
  proposed earlier and they're right, say so plainly and rebuild. If their idea has a flaw,
  name the flaw and the strongest version of their idea at the same time. (The best moments in
  planning are reversals: "do we really need this stage?" deserves a real answer, not defense.)
- **Develop the user's ideas forward.** When the user proposes a direction, build it out to its
  strongest form before judging it. "Let's follow that thread" beats "here's another menu."
- **One decision per exchange.** If a topic explodes into five sub-decisions, stack them and
  take them in order. Tell the user how many are in the queue so they can see the shore.
- **Keep a visible open-decisions list.** Decisions get resolved one by one; nothing resolves
  silently. When a round of decisions lands, batch all the document edits and apply them in one
  pass — don't churn the docs after every exchange.

## Stage 3 — Draft: the document plus its companion, in one move

When the direction is settled enough, write the doc — don't ask permission to start drafting if
drafting was the stated goal. A draft is a *proposal*: it makes the remaining open questions
concrete instead of abstract.

- Layout, naming, and per-layer content guides: read `references/doc-layout.md` before your
  first draft in a repo.
- Every PRD gets a companion `<stem>-overview.html` **in the same commit** — a self-contained
  visual walkthrough the human reviews instead of the markdown. Build it from
  `assets/overview-template.html`; authoring guide in `references/html-artifacts.md`.
- The companion ends with a **"things to poke at"** section: the open questions the draft
  answers implicitly or defers — written *for* the reviewer, to focus the next review round.
- Documents claim only what's decided or evidenced; mark inference as inference. A decisions
  table with traceability (open question → resolution → where) goes in the doc, so future
  readers see not just *what* but *that it was deliberately chosen*.

## Stage 4 — Review rounds: resolve, batch, commit

The human reviews the HTML companion and comes back with reactions and questions — or you walk
the "things to poke at" list together, **one item at a time** (same exchange shape as Stage 2).
For asynchronous review, the companion doubles as the feedback instrument: its poke-at items
carry comment boxes and an "Export review" button that downloads a `<stem>-feedback.json` you
then walk through item by item (see `references/html-artifacts.md` → Review capture).
After a round resolves: batch-apply the edits to the markdown *and* regenerate the affected
companion sections, update the decisions table, commit with the rationale in the message. Then
surface what's still open.

Repeat until the open list is empty or everything left is deliberately deferred (say which).

## Stage 5 — Descend a layer

A finished high-level PRD implies a feature list; each feature gets its own PRD (Stages 1–4
again, at feature altitude), and each feature PRD gets an implementation plan. Recommend a
build order with reasoning (risk and proof first, not document order). One feature doc at a
time — finish and review before starting the next, unless the user asks for parallel drafts.

## Ephemeral visuals — make decisions seeable

Whenever a decision under discussion is easier *seen* than read — two architectures side by
side, a scheduling timeline, config layer precedence, a state machine, before/after of a
restructure — render a quick self-contained HTML to `/tmp/better-planning/<topic>.html` and tell
the user to open it. Same design language as the companions (use the template's components),
but throwaway: it exists to get one decision made, it is not committed, and it can be sloppier
than a companion. Offer one proactively when an exchange goes back and forth twice without
landing — that's the signal that prose isn't carrying the picture.

## Vocabulary discipline

Maintain `docs/better-planning/GLOSSARY.md` from the first draft onward: every term used with a
precise meaning gets an entry — definition, **what it must not be confused with**, where it's
specced. Update it in the same commit as any change that introduces, renames, or sharpens a
term. When naming new concepts, prefer descriptive over metaphorical names (a name that explains
the design beats a name that decorates it), and rename early — drift is cheap to fix before
code exists and expensive after. If the vocabulary starts governing code (schema fields, CLI
flags), offer to promote the glossary to the repo root as a signpost file.

## Git hygiene

Work on a branch per planning milestone; follow the repo's existing PR habits. Commit messages
carry the *rationale*, not just the change — the commit history is part of the decision record.
Ask before the first push to any remote; after that, follow the established rhythm. If there is
no git repo, offer to init one — planning artifacts deserve history.

## What this skill is not

- Not a code generator: planning ends at implementation plans; building is a separate activity
  (the plans should make it easy to start).
- Not a form-filler: never march the user through a fixed questionnaire. The process adapts —
  a tiny feature might need one conversation and one doc; a product needs the full ladder.
- Not append-only paperwork: superseded docs move to `archive/`, the README index always
  reflects reality, and a doc that no longer matches a decision is a bug to fix immediately.
