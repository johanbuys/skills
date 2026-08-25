# `setup <track> [capstone]` · `setup <track> --sharpen` — produce a ladder, not a curriculum.

Output: one file, `.dojo/tracks/<track>.yaml`, plus a `check` template if the language has
none. No lessons, no katas — those are generated one per session from the ladder and the learner
model. Pre-writing lessons is the planning trap; the ladder is a hypothesis revised every 5th session.

## Steps
1. **Toolchain gate.** Run the version command (`node --version`, `odin version`, …). If it fails,
   stop and say what to install. Nothing else happens.
2. **One research subagent** (general-purpose, ~5–10 min), three sources with three jobs:
   - **Official docs → coverage.** Walk the full table of contents. Every core concept becomes a
     ladder item; nothing may fall off. This is the checklist, not the order.
   - **Two or three well-regarded courses/books → sequence.** Docs are a reference organised by
     category; courses are organised by how people learn. Take the order and the prerequisite
     edges from the courses; where they disagree, prefer the order that reaches a runnable thing
     soonest.
   - **The capstone → tiebreak.** If named, list its bricks and tag each with the concept it needs.
     Order does not bend to the capstone; it only breaks ties among unlocked items. If *not* named
     (learn mode only), return **three bounded briefs** instead — see "Choosing a capstone" below.
   Return 15–20 ordered items: slug, plain-words name, prereqs, doc URL, "done when" (the smallest
   thing that proves it), which course(s) place it where. Then the brick list, each brick one
   concept, each ending in something visible. For a language track, flag interference with
   `home_lang` ("not like X's Y because …"). One agent, one pass.
3. **Choose the capstone** if none was named (learn mode only) — one question, see below.
4. **Write the YAML** in the shape below. Under 80 lines. Human-readable first. Also write the
   capstone's name into `learner.capstone` so the design diagnostic and `status` can use it.
5. **Template.** `check` must exit 0 on green, print one line, run < 10 s. Prove it on a two-line
   example, then delete the example.
6. **Say what you made** in three lines, and whether `learner.focus` should change (the learner edits it).

## Choosing a capstone (learn mode, none named)
A learn track builds toward one real thing. Evidence: experienced learners persist and transfer
better inside an authentic whole task with a visible next step (proximal sub-goals, whole-task
practice) than on isolated exercises; a blank "build anything" costs more decision time than a
short menu of fixed briefs. So the research agent returns **three briefs**, each bounded:
- a name, one sentence of what it is, and *who would actually use it* (the learner counts);
- three to four fixed nouns (`nouns:` — the domain never grows);
- a brick list, one concept per brick, each ending in something visible;
- the ladder items it exercises, and the one thing it deliberately leaves out.
Briefs are drawn from `learner.context` and the sharpen tracks (a React sharpen track suggests the
thing has a UI) — they must differ in *domain*, not in size. Ask in ONE turn: "1 / 2 / 3 / or name
your own" — the learner's own idea, if any, always wins; bound it the same way before writing it
down. Never choose for the learner, never re-ask in a later session, and never let a session pick
a brick: the rules do that. Sharpen tracks have no capstone.

## Sharpen mode
Same research, same YAML with `mode: sharpen`, plus one extra step: seed every ladder item into
`learner.concepts` as `{state: practiced, last: today, ev: "seeded by setup --sharpen"}` with `due`
spread evenly over the next 30 days. Sharpen tracks are never `focus`; they are drill and review
material. A concept that misses a drill twice is demoted to `introduced` and gets one kata.

A capstone may need a concept before the ladder reaches it. The agent then *scaffolds* that code
("you'll meet this at ladder item N"), records it in `capstone.scaffolded`, and it becomes drill
material later — "read this" first, then "fix this" — so the ladder catches up with the codebase.

## Shape
```yaml
track: nest
mode: learn                       # learn (climbed by katas) | sharpen (seeded practiced, drills only)
lang: ts                          # assets/templates/ts/check
toolchain: "npx nest --version"
sources: [https://docs.nestjs.com/, "<course 1>", "<course 2>"]
ladder:
  - {slug: modules,      name: "modules and the app tree",  prereqs: [],             done: "a second module imported by AppModule", doc: https://docs.nestjs.com/modules}
  - {slug: providers-di, name: "providers and injection",   prereqs: [modules],      done: "a service injected into a controller",  doc: https://docs.nestjs.com/providers}
  - {slug: dto-pipes,    name: "DTOs and validation pipes", prereqs: [providers-di], done: "POST returns 400 on a bad body",        doc: https://docs.nestjs.com/pipes}
capstone:                         # learn mode only; mirrored into learner.capstone
  name: "…"
  brief: "one sentence; who uses it"
  leaves_out: "the one thing this deliberately does not do"
  repo: ~/projects/<name>         # built at agent speed as a product; katas are carved from it
  nouns: [Workout, Set, Exercise] # keep the domain constant; one story
  bricks:
    - {n: 1, concept: modules, brick: "scaffold + GET /health", visible: "curl 200"}
  scaffolded: []                  # concepts the agent wrote ahead of the ladder; future drill material
interference:                     # language tracks only
  - "Odin slices are views with no ownership — not like TS arrays"
```
