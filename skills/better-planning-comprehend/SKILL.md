---
name: better-planning-comprehend
description: "On-demand, plain-language catch-up for a system agents have been building — when the human has lost the thread of their own project, it rebuilds their mental model: the shape of the system (the handful of concepts and how they connect), what changed lately and why it matters, and how any one piece actually works, explained straight with real code walkthroughs and a diagram when a picture beats prose. Pull, not ceremony: no prerequisites (it uses the TDD and planning docs when they exist and reads the code when they don't), no bookkeeping, no quiz unless asked. Use it whenever the human wants to understand their own system — \"catch me up\", \"what changed since last week?\", \"explain how X works so I can feel it\", \"walk me through the flow\", \"am I still across this?\", \"I've been away, get me back into the project\" — even mid-task, the moment they sound lost."
---

# Better Planning · Comprehend (on-demand catch-up)

The quiet failure of agentic coding: the agents write more and more code, and you lose your grip on
your own system — not all at once, but one unseen decision at a time, until you feel like a
spectator to your own codebase. There's too much code to read it all, and the agents make calls you
never see. This skill is the counter-move, and it works like a good colleague, not a scheduled
review: **when the human asks, explain the system plainly until they hold it again.** Nothing to
maintain, nothing to prove — comprehension on demand.

It carries the better-planning name because it's *better with* the family's artifacts — a TDD is a
ready-made map, a drift ledger is a ready-made changelog — but it has **no prerequisites**: on a
repo with no planning space at all, read the code and git history and explain from those. Never
refuse a catch-up for lack of docs; a project with no design of record is where the human is *most*
lost.

## When it runs

Whenever the human wants their system back in their head:

- **"Catch me up / I've been away"** — rebuild the whole picture: the shape, then what moved.
- **"What changed since <X>?"** — the recent moves, framed on the shape, not as a diff list.
- **"Explain how <piece> works — so I can feel it"** — one concept, walked concretely.
- **Mid-anything** — a review, a build session, a planning round — the moment they sound lost.
  Losing the thread mid-task is the normal case, not an interruption of the real work.

## How to explain — the craft

The bar: after the walk, the human could *test the thing themselves* and predict what it does.
Not "they nodded" — "they could drive it."

- **Shape first, always.** Start with the handful of concepts and how they connect — one screen,
  high altitude — before any detail. A change-by-change or file-by-file walk with no map is why
  catch-ups feel too low to follow. If **canvas** is installed, draw the shape as a diagram-kit
  diagram (a node per concept, arrows for connections) and point at it as you go; a clean text
  sketch works when it isn't. The picture is a means here, not a requirement.
- **Plain language, straight.** Short sentences. Name the actual files, commands, and behaviors.
  No doublespeak, no elegant abstraction where a concrete sentence works. "When a request comes
  in, `router.ts` picks a handler by looking at X" beats a paragraph about separation of concerns.
- **Make it runnable.** Ground every concept in something the human can do: the command to run,
  the log line they'd see, the test that proves it. "Feel it" means touched, not admired.
- **Changes are moves on the map.** "The coordinator grew a responsibility", "a new concept
  appeared between X and Y" — never a flat list of diffs. Call out complexity growth plainly: a new
  concept, or one that ballooned past its original job. That's the "did my simple idea get
  complex?" check.
- **Start high, zoom where they point.** The human steers the altitude. Answer the question they
  asked, offer the layer below, stop when they say they've got it.

Sources, best first: the TDD and drift ledger (if the planning space exists — read
`docs/better-planning/README.md`'s index to find them), the plan's milestones, git log and diffs,
the code itself. When docs and code disagree, say so plainly — and offer **better-planning-sync**
to reconcile; don't do sync's job mid-explanation, and don't let the discrepancy pass silently.

## Recall — only when invited

No quiz by default. A recall check ("say back what changed before I show you") is a genuinely good
learning tool *when the human wants to learn* — and pure ceremony when they want orientation. If
they ask — "quiz me", "check I've got this" — do it properly: recall before reveal, then have them
explain the shape back. Otherwise the walk ends when they say they're good.

For a topic that deserves a real deep dive — a concept they keep bouncing off, a technology the
build leans on — offer to park it: append one line to `~/.study/topics.md` (the **study** skill's
queue) with the topic and the repo + file context. Capture it and keep going; never turn a catch-up
into a lesson they didn't ask for.

## What this leaves behind

Nothing, by default — that's the point. No ledger entries, no status rows, no commits; the human's
refreshed mental model is the entire output. Two exceptions, both offered rather than assumed: an
explainer artifact ("want this walk as an HTML page / doc to keep?" — `references/html-artifacts.md`
covers the ephemeral-visual conventions), and a study parking line as above.

## What this skill is not

- Not sync: it changes no artifacts and reconciles nothing. Milestone-boundary reconciliation,
  drift ledgers, and living-TDD updates are **better-planning-sync** — offer it when the walk
  surfaces real drift.
- Not a code reviewer: "how does it work" is its question, never "is it good".
- Not study: this is a single-sitting orientation on *your* system; study is the deep, recall-
  checked dive on a parked topic. They hand off to each other.
- Not a gate: nothing downstream waits on it, and no skill should send the human here as a
  precondition. It exists for exactly one trigger — a human who wants their system back.
