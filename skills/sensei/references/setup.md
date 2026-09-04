# `setup <track> [capstone]` · `setup <track> --sharpen` — a ladder, a capstone shell, resources per rung. Not a curriculum.

Output: `.dojo/tracks/<track>.yaml`, a `check` template if the language has none, and — learn mode —
the capstone app at `capstone/<name>/` running with one health route. No lessons, no katas — those are
generated one per session from the ladder and the learner model. Pre-writing lessons is the planning
trap; the ladder is a hypothesis revised every 5th session.

**Setup is idempotent.** If `.dojo/tracks/<track>.yaml` already exists, do not redo the research.
Fill only what is missing, in this order, and say which you filled: the capstone shell
(`capstone/<name>/` absent), the per-rung `resources` (any rung without three), the `check`
template. Nothing else is touched. This is also the migration path for a dojo made before the
capstone lived inside it: `/sensei setup <track>` and stop.

## Steps
1. **Toolchain gate.** Run the version command (`node --version`, `odin version`, …) and, for a learn
   track, the framework's generator (`npx @nestjs/cli --version`). If it fails, stop and say what
   to install. Nothing else happens.
2. **One research subagent** (general-purpose, ~5–10 min), three sources with four jobs:
   - **Official docs → coverage.** Walk the full table of contents. Every core concept becomes a
     ladder item; nothing may fall off. This is the checklist, not the order.
   - **Two or three well-regarded courses/books → sequence.** Docs are a reference organised by
     category; courses are organised by how people learn. Take the order and the prerequisite
     edges from the courses; where they disagree, prefer the order that reaches a runnable thing
     soonest.
   - **The capstone → tiebreak.** If named, list its bricks and tag each with the concept it needs.
     Order does not bend to the capstone; it only breaks ties among unlocked items. If *not* named
     (learn mode only), return **three bounded briefs** instead — see "Choosing a capstone" below.
   - **Resources per rung.** For every ladder item, three to five real inputs a learner reads or
     watches the night before: the exact docs section (anchor URL), one course section or video
     with a timestamp range, optionally one article or talk. Each with `kind`, `title`, `url`,
     `where` (section name or `mm:ss–mm:ss`) and `min`. Verified to exist — fetch the URL; a dead
     link at nine in the evening is the whole prep lost. Ten minutes of reading per rung, total.
   Return 15–20 ordered items: slug, plain-words name, prereqs, doc URL, "done when" (the smallest
   thing that proves it), which course(s) place it where, and its resources. Then the brick list,
   each brick one concept, each ending in something visible. For a language track, flag interference
   with `home_lang` ("not like X's Y because …"). One agent, one pass.
3. **Choose the capstone** if none was named (learn mode only) — one question, see below.
4. **Write the YAML** in the shape below. Under 120 lines. Human-readable first. Also write the
   capstone's name into `learner.capstone` so the design diagnostic and `status` can use it.
5. **Build the capstone shell** (learn mode). Run the framework's generator into `capstone/<name>/`
   (`npx @nestjs/cli new <name> --skip-git --package-manager npm`, or the track's equivalent),
   strip the sample route, add `GET /health` returning `{ok:true}`, and prove it: start it with
   `capstone.run` in the background, wait for `capstone.probe` to answer, stop it by port. Record
   `run`, `probe`, `port` and `test_one` (how to run a single spec file) in the YAML. Commit:
   `capstone(<name>): shell`. Nothing from the ladder is built ahead — brick 1 is the first kata.
   The shell is boilerplate, and boilerplate is yours to write; the first decision is the learner's.
6. **Template.** `check` must exit 0 on green, print one line, run < 10 s. For a capstone track,
   the template runs `test_one` on the brick's spec; prove it on a two-line spec, then delete the
   spec.
7. **Say what you made** in four lines — ladder, capstone shell and how to run it, resources, whether
   `learner.focus` should change (the learner edits it).

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
Same research (resources included — they feed "read this" drills and the rare sharpen lesson),
same YAML with `mode: sharpen`, no capstone, plus one extra step: seed every ladder item into
`learner.concepts` as `{state: practiced, last: today, ev: "seeded by setup --sharpen"}` with `due`
spread evenly over the next 30 days. Sharpen tracks are never `focus`; they are drill and review
material. A concept that misses a drill twice is demoted to `introduced` and gets one kata.

A capstone may need a concept before the ladder reaches it. The agent then *scaffolds* that code
("you'll meet this at ladder item N"), commits it as `capstone(scaffold): <concept> ahead of rung N`,
records it in `capstone.scaffolded`, and it becomes drill material later — "read this" first, then
"fix this" — so the ladder catches up with the codebase.

## Shape
```yaml
track: nest
mode: learn                       # learn (climbed by katas) | sharpen (seeded practiced, drills only)
lang: ts                          # assets/templates/ts/check
toolchain: "node --version · npx @nestjs/cli --version"
sources: [https://docs.nestjs.com/, "<course 1>", "<course 2>"]
ladder:
  - slug: first-route-and-its-inputs
    name: "a route that answers, and where its inputs come from"
    prereqs: []
    done: "one curl returns JSON; another echoes back the path param, a query param and the body"
    doc: https://docs.nestjs.com/controllers
    resources:
      - {kind: docs,  title: "Controllers — request object",  url: "https://docs.nestjs.com/controllers#request-object", where: "the decorator table", min: 4}
      - {kind: docs,  title: "Controllers — status code",     url: "https://docs.nestjs.com/controllers#status-code",    where: "one paragraph", min: 2}
      - {kind: video, title: "NestJS Fundamentals — Controllers", url: "https://courses.nestjs.com/", where: "04:10–11:40", min: 8}
  - slug: the-type-is-a-lie
    name: "proving a TypeScript type on a body constrains nothing"
    prereqs: [first-route-and-its-inputs]
    done: "a payload with seats:\"banana\" returns 201 and logs it"
    doc: https://docs.nestjs.com/controllers
    resources: [...]
capstone:                         # learn mode only; mirrored into learner.capstone
  name: tiny-flag
  brief: "one sentence; who uses it"
  leaves_out: "the one thing this deliberately does not do"
  repo: capstone/tiny-flag        # inside the dojo. One repo, one authorship audit, one git log.
  run: "npm run start:dev"        # from repo; the agent starts it at kata setup if probe fails
  probe: "curl -sf localhost:3000/health"
  port: 3000
  test_one: "npx jest --config test/jest-e2e.json --runTestsByPath"   # + the spec path; < 10 s
  nouns: [Flag, Environment, Rule, Change]   # keep the domain constant; one story
  bricks:
    - {n: 1, concept: first-route-and-its-inputs, brick: "GET /flags and GET /flags/:key over hard-coded data", visible: "curl returns JSON"}
  scaffolded: []                  # concepts the agent wrote ahead of the ladder; future drill material
interference:                     # language tracks only
  - "Odin slices are views with no ownership — not like TS arrays"
```
