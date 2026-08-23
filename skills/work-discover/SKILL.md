---
name: work-discover
description: "Build shared understanding of an idea, feature, or PRD by letting the human experience prototypes and slices — then exit to a plan, an issue, or a recorded no."
disable-model-invocation: true
---

# Work: discover

Take an idea, thought, feature, or PRD to **shared understanding** between human and agent. Alignment is demonstrated, never asserted — the bar is *the human experienced a vertical slice or prototype and reacted*, not *the human approved a document*.

## Ground yourself

Read `CONTEXT.md` (repo root) and use its vocabulary. Check `docs/adr/` before proposing a direction that touches decided ground; when a direction gets chosen or rejected for a reason worth keeping, write a new ADR — [adr-template.md](adr-template.md) is the shape, and its **Alternatives considered** section is the part that stops the next agent re-litigating the same debate.

If the repo has a `CONSTITUTION.md` (root), it is binding law — a direction that conflicts with a MUST principle either changes or openly proposes an amendment; law changes deliberately, never by drift. If there is no constitution and the same standing rule keeps coming up, you may propose founding one — but only the human legislates: never scaffold it yourself.

A term earns a `CONTEXT.md` entry the moment discovery reveals that you and the human mean different things by it — add it then, in a sentence, creating the file if this is its first entry. That is the only bar; don't catalogue vocabulary that nobody has misunderstood.

## Work the question

Loop: show something, get a reaction, fold it in.

- A question the human should settle by *experiencing* something — a state model, logic flow, UI, or feasibility bet → `/work-prototype`: a builder subagent constructs a throwaway artifact while you stay in the conversation. Its rules bind here too: say what you're about to build and what the human will get to open **before** building, and never let the first mention of an artifact be in the past tense.
- Structure easier seen than read → a diagram or pseudo-code. Use the `canvas` skill when it's installed: the diagram is served over the network with a comment box beside it, so the reaction lands on the picture instead of scrolling past it in chat. When it isn't, carry the essence — a diagram in the reply, and ask what's wrong with it.
- Open questions → ask them one at a time, in plain words. Multiple choice is for picking scope at the start; once artifacts exist, ask for reactions in the open ("what feels wrong?"), not as options to grade. Vocabulary borrowed from an issue or doc gets one plain-words line before you use it on the human.

Feedback from what the human experienced shapes the plan. Terminal output narrated in chat is not "shown". If discovery is producing artifacts nobody has experienced, it isn't done — it's stalled. Stop writing and build something the human can react to.

## Three exits, all legitimate

1. **A plan** — worth doing now. Write `plans/<slug>.md` on a work branch: what we're building and why, what the prototypes settled, and acceptance criteria as plain sentences ("a user can X and sees Y"). No codes, no statuses, no template beyond that. `/work-implement` runs it; it is deleted at ship.
2. **An issue** — real, but later. File it on the tracker in plain words; the first line says what it is.
3. **A recorded no** — closed. Write an ADR if the why is worth keeping; otherwise the handoff entry is enough.

A discovery that ends in an issue or a no succeeded. Reaching a plan is not the goal; understanding is.

## Closing contract

Open this work's `## <slug>` section in `handoff.md` (repo root; create the file if needed) **when discovery starts** — first entry: the question, verdict "none yet". Update the entry after each shown artifact and at every exit: what moved, what's next, and the **verdict** — what the human actually experienced running, in plain words, or "none". Sessions end without warning; an entry written only "at the end" is an entry that doesn't get written. A session that produced only conversation says so.
