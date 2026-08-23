---
name: work-prototype
description: "Answer a design or feasibility question with a throwaway artifact built by a subagent — the main session stays in the conversation while a builder constructs something the human can open, run, and react to. Use when a question should be settled by experiencing something rather than by discussion: 'prototype this', 'spike this', 'does this state model feel right', 'what should this look like', 'can this even work'."
---

# Work: prototype

A prototype is throwaway code that answers a question. This skill is the dispatch wrapper around building one: **you stay the conversation partner; a fresh subagent does the typing**, so your context stays clear for the reaction loop instead of filling with build attempts.

## Before dispatching — the beat that keeps trust

Tell the human, in one or two sentences: the question this artifact will answer, and what they will get to open or run. If the question came from you rather than from them, wait for a nod before building. The first mention of an artifact must never be in the past tense.

The artifact is never the first place a design decision appears. Name the direction you'd take — your recommendation in a line, plus one or two real alternatives when the human might see it differently or has no opinion yet to lean on. Taste calls — UI, interface shapes, data structures, and stack or architecture when they're genuinely open — belong to the human and are made at the offer, before the build. The offer is one message, not a ceremony; a nod is enough.

If the question's vocabulary came from an issue or doc (a "spike", a codename), say what it means in plain words the first time you use it.

## Dispatch

One fresh builder subagent per artifact — parallel builders only for deliberately different takes on the same question (three UI variants, two competing state models). The dispatch contains:

- the question, verbatim, and the artifact's home — the session scratchpad for pure logic demos; next to the code it probes when repo context matters, clearly named as throwaway; never committed to main;
- the path to `CONTEXT.md` when it exists, so the artifact speaks the domain's language — and the note that beyond what the offer settled, the builder builds in whatever is quickest: a throwaway prototype's stack is not a decision;
- the rules: invoke the `/prototype` skill (from mattpocock/skills) when installed — the essence fallback below is for when it is *absent*; paraphrasing an installed skill is a skip, not a fallback. Without it: clearly marked throwaway, trivial to run, no persistence, no polish, the full state surfaced after every action;
- the reply contract: return the artifact path and one line on how to open it — not an analysis, not conclusions.

## Hand over, then stop

Give the human the artifact and the one line on how to open it: a double-clickable HTML file, a `canvas` page when that skill is installed (served over the network, captures reactions next to the thing itself), or a single command. **Terminal output narrated in chat is not a deliverable** — if the human can't open, click, or run it themselves, it hasn't been shown. Then wait. Their reaction decides the next round: reshape, another variant, or answered. Ask for reactions in the open ("what feels wrong?"), not as multiple choice.

## When it's answered

Say the verdict in plain words — the question, and what the artifact showed. Feed it back to whatever invoked this (usually `/work-discover`, which folds it into the plan and its `handoff.md` entry); a settled direction that passes `work-discover`'s ADR bar (hard to reverse, surprising without context, a real trade-off) becomes an ADR in `docs/adr/`, following `work-discover/ADR-FORMAT.md`. Invoked standalone, write the `handoff.md` entry yourself — dated, under the work's `## <slug>` section, verdict being what the human actually experienced. The artifact dies unless the human wants it kept on a throwaway branch.

## Guardrail

One question per artifact. If the build needs a plan, tasks, or review gates, it stopped being a prototype — take it to `/work-discover` for a plan instead.
