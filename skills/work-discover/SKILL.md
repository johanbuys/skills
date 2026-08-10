---
name: work-discover
description: "Build shared understanding of an idea, feature, or PRD by letting the human experience prototypes and slices — then exit to a plan, an issue, or a recorded no."
disable-model-invocation: true
---

# Work: discover

Take an idea, thought, feature, or PRD to **shared understanding** between human and agent. Alignment is demonstrated, never asserted — the bar is *the human experienced a vertical slice or prototype and reacted*, not *the human approved a document*.

## Ground yourself

Read `CONTEXT.md` (repo root) and use its vocabulary. Check `docs/adr/` before proposing a direction that touches decided ground; when a direction gets chosen or rejected for a reason worth keeping, write a new ADR.

If the repo has a `CONSTITUTION.md` (root), it is binding law — a direction that conflicts with a MUST principle either changes or openly proposes an amendment; law changes deliberately, never by drift. If there is no constitution and the same standing rule keeps coming up, you may propose founding one — but only the human legislates: never scaffold it yourself.

A term earns a `CONTEXT.md` entry the moment discovery reveals that you and the human mean different things by it — add it then, in a sentence, creating the file if this is its first entry. That is the only bar; don't catalogue vocabulary that nobody has misunderstood.

## Work the question

Loop: show something, get a reaction, fold it in.

- A state model, logic flow, or UI the human should *feel* → a prototype: throwaway code that answers a question. Use the `/prototype` skill (from mattpocock/skills) when it's installed; when it isn't, carry its essence yourself — clearly marked throwaway, trivial to run, no persistence, no polish, the full state surfaced after every action.
- Structure easier seen than read → a diagram or pseudo-code.
- Open questions → ask them one at a time, in plain words.

Feedback from what the human experienced shapes the plan. If discovery is producing artifacts nobody has experienced, it isn't done — it's stalled. Stop writing and build something the human can react to.

## Three exits, all legitimate

1. **A plan** — worth doing now. Write `plans/<slug>.md` on a work branch: what we're building and why, what the prototypes settled, and acceptance criteria as plain sentences ("a user can X and sees Y"). No codes, no statuses, no template beyond that. `/work-implement` runs it; it is deleted at ship.
2. **An issue** — real, but later. File it on the tracker in plain words; the first line says what it is.
3. **A recorded no** — closed. Write an ADR if the why is worth keeping; otherwise the handoff entry is enough.

A discovery that ends in an issue or a no succeeded. Reaching a plan is not the goal; understanding is.

## Closing contract

Before ending, append one dated entry to this work's `## <slug>` section in `handoff.md` (repo root; create the file or section if new): what moved, what's next, and the **verdict** — what the human actually experienced running, in plain words, or "none". A session that produced only conversation says so.
