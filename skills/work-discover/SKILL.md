---
name: work-discover
description: "Build shared understanding of an idea, feature, or PRD by letting the human experience prototypes and slices — then exit to a plan, an issue, or a recorded no."
disable-model-invocation: true
---

# Work: discover

Take an idea, thought, feature, or PRD to **shared understanding** between human and agent. Alignment is demonstrated, never asserted — the bar is *the human experienced a vertical slice or prototype and reacted*, not *the human approved a document*.

## Ground yourself

Read `CONTEXT.md` and use its vocabulary. Read `CONSTITUTION.md` if it exists. Skim `docs/adr/` by filename — the names say which decisions bear on this session; read only those.

```
/
├── CONTEXT.md
├── CONSTITUTION.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If the repo has a `CONSTITUTION.md` (root), it is binding law — a direction that conflicts with a MUST principle either changes or openly proposes an amendment; law changes deliberately, never by drift. If there is no constitution and the same standing rule keeps coming up, you may propose founding one — but only the human legislates: never scaffold it yourself. Flag every conflict with `CONSTITUTION.md`; never silently drop one.

A term earns a `CONTEXT.md` entry the moment discovery reveals real friction around it — you and the human mean different things by it, or it's too vague to carry the discussion and had to be sharpened. Add it then, in a sentence, creating the file if this is its first entry. That is the only bar; don't catalogue vocabulary nobody has stumbled over. The bar decides *when* a term gets in; [CONTEXT-FORMAT.md](CONTEXT-FORMAT.md) decides *how* it's written.

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily: only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. Hard to reverse: the cost of changing your mind later is meaningful
2. Surprising without context: a future reader will wonder "why did they do it this way?"
3. The result of a real trade-off: there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](ADR-FORMAT.md). An ADR's **Alternatives considered** section is the part that stops the next agent re-litigating the same debate.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account': do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up: capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. Do not treat `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

## Work the question

Open with your understanding, not questions: one tight paragraph — main ideas as `-` bullets if that reads better — built from the sources and context files, then ask if it matches.

Follow with the questions that take the human to the root of the problem — the ones that expose intent, stakes, and boundaries. Judgment stays with the human; facts stay with the sources. Never ask the human to be a lookup table: if the code or sources answer something, don't ask it as a question — but when a settled thing bears on the direction, surface it as an assumption to confirm ("the code cancels whole orders today; I'm assuming that stands"). One line to confirm beats a debate reopened.

Then get out of conversation as fast as you can. The moment a question would be settled better by experiencing something than by discussing it — even on turn two — switch to the loop. Talking is the opener, not the method.

Loop: show something, get a reaction, fold it in.

Every show starts as an offer. Before building, name the opportunity ("this is worth mapping visually", "here's the design I have in mind") and the direction you'd take — your recommendation in a line, plus one or two real alternatives when the human might see it differently or has no opinion yet to lean on. The artifact is never the first place a design decision appears: taste calls — UI, interface shapes, data structures, and stack or architecture when they're genuinely open — belong to the human, and a default silently baked into a prototype is how rework happens. When such a call sticks, it's ADR material — and a throwaway prototype's stack is not a decision; the real choice is made at the offer, not inherited from whatever the prototype was built in. The offer is one message, not a ceremony; a nod is enough to build.

- A question the human should settle by *experiencing* something — a state model, logic flow, UI, or feasibility bet → `/work-prototype`: a builder subagent constructs a throwaway artifact while you stay in the conversation. Its rules bind here too: say what you're about to build and what the human will get to open **before** building, and never let the first mention of an artifact be in the past tense.
- Structure easier seen than read → a diagram or pseudo-code. Use the `canvas` skill when it's installed: the diagram is served over the network with a comment box beside it, so the reaction lands on the picture instead of scrolling past it in chat. When it isn't, carry the essence — a diagram in the reply, and ask what's wrong with it.
- Open questions → ask them one at a time, in plain words. Multiple choice is for picking scope at the start; once artifacts exist, ask for reactions in the open ("what feels wrong?"), not as options to grade. Vocabulary borrowed from an issue or doc gets one plain-words line before you use it on the human.

At any point in the loop:

- Pivots are natural. When you detect one, say so in a line, flow into the new direction, and update the artifacts already created.
- If the idea is multifaceted, suggest break points and offer to focus on one part.

Feedback from what the human experienced shapes the plan. Terminal output narrated in chat is not "shown". If discovery is producing artifacts nobody has experienced, it isn't done — it's stalled. Stop writing and build something the human can react to.

## Three exits, all legitimate

1. **A plan** — worth doing now. Write `plans/<slug>.md` on a work branch: what we're building and why, what the prototypes settled, and acceptance criteria as plain sentences ("a user can X and sees Y"). No codes, no statuses, no template beyond that. `/work-implement` runs it; it is deleted at ship.
2. **An issue** — real, but later. File it on the tracker in plain words; the first line says what it is.
3. **A recorded no** — closed. Write an ADR if the why is worth keeping; otherwise the handoff entry is enough.

A discovery that ends in an issue or a no succeeded. Reaching a plan is not the goal; understanding is.

## Closing contract

Open this work's `## <slug>` section in `handoff.md` (repo root; create the file if needed) **when discovery starts** — first entry: the question, verdict "none yet". Update the entry after each shown artifact and at every exit: what moved, what's next, and the **verdict** — what the human actually experienced running, in plain words, or "none". Sessions end without warning; an entry written only "at the end" is an entry that doesn't get written. A session that produced only conversation says so.
