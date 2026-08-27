# Diagnostics — the first three sessions. Agent silent. They write `learner.baseline`.

Most learners cannot say how far their hands-on skills have slipped. The model starts from
evidence. Each is 20 min, scored against a rubric; no hints, no Socratic help until the clock says
15. Parametrised by `learner.home_lang`, the learn and sharpen tracks, and the capstone domain if any.

**The rubric and the planted lists are hidden.** They go in `.dojo/keys/<kata-id>.yaml`, never in
the kata directory and never on the page — a visible rubric teaches the shape, which is exactly what
a baseline must not measure. `meta.yaml` carries no `planted_issues` count.

**Serve the page for these** (`references/serve.md`) — the clock and the check are the two things
every diagnostic needs, and the review one needs the diff commenter. Agent silent still holds:
writing `page.json` is not talking.

**Re-running them later** (a new surface, a year of practice) is allowed: set `queue` to the three
diagnostics and go. `learner.baseline` is overwritten, and that is safe — `.dojo/` is versioned, so
the previous baseline stays in `git log` and both runs stay in `log.jsonl`. Say in one line that the
second run is measured on material already seen, so the two are worth diffing but not comparing
as like for like.

## diag-1 · debug (`home_lang`)
Generate `katas/<date>-diag-debug/`: a ~60-line module in a small domain with **two** planted
bugs (one logic, one boundary) and tests that fail on both. Score: bugs found /2, time to green,
whether they added a test. Note the approach (read first? ran tests first? printf?).

## diag-2 · review (the tracks)
A ~50-line diff shaped like the learn track, written in a sharpen track's language where possible
(e.g. a controller + service + DTO) with **five** planted
issues (missing validation, business logic in the wrong layer, an unhandled promise, a blocking
or N+1 call, an idiom smell). They write `REVIEW.md` as PR comments. Score: found /5, false
positives, whether comments name the fix. What they flag seeds the ladder — they already know it.

Use a `review` card with the diff and `writable: ["<kata>/REVIEW.md"]`, so anchors come from the
hunk headers instead of the learner counting `+` lines, and the file is on disk at the wall. The
`check` asserts each comment has What / Why / Instead and that every anchor is a line in the diff.
The planted five live in `.dojo/keys/`; the count is never shown.

## diag-3 · design
Prompt drawn from the capstone domain (or a generic one: "an app that must work offline and sync
later"). 12 minutes, one page: context · options · decision · consequences. Rubric /5: sync or
consistency strategy named with its failure modes · idempotency addressed · data ownership clear ·
one cost/scale trade-off · one thing explicitly out of scope.

The rubric is hidden — it is the measurement. Use a `kata` card naming only the four headings and
`writable: ["<kata>/DESIGN.md"]`. State the brief's boundary explicitly (which side of the system
they own), because designing the wrong side is a common and uninformative failure.

## After diag-3
Write `learner.baseline: {debug: x/2 in Nm, review: x/5, design: x/5, note: "<one line>"}`. Say, in
plain words, what the three numbers suggest — usually fluency (blank-file writing) slips first and
judgment (review, design) holds; say which it is here, with the evidence. Then:
- If `.dojo/tracks/<learn>.yaml` exists: set the queue to its first ladder items and, if `focus` is
  still `diagnostics`, propose `focus: <learn>` in one sentence (the learner edits it).
- If it does not: leave the queue empty and end with the exact commands to run before the next
  session — `/sensei setup <learn> [capstone]` and `/sensei setup <each sharpen track> --sharpen` —
  filled in from `learner.learn` and `learner.sharpen`. Setup is a separate command, not a session.
  The next `/sensei start` with an empty queue and no track repeats this instruction and stops.
