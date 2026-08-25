# Diagnostics — the first three sessions. Agent silent. They write `learner.baseline`.

Most learners cannot say how far their hands-on skills have slipped. The model starts from
evidence. Each is 20 min, scored against a rubric; no hints, no Socratic help until the clock says
15. Parametrised by `learner.home_lang`, the learn and sharpen tracks, and the capstone domain if any.

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

## diag-3 · design
Prompt drawn from the capstone domain (or a generic one: "an app that must work offline and sync
later"). 12 minutes, one page: context · options · decision · consequences. Rubric /5: sync or
consistency strategy named with its failure modes · idempotency addressed · data ownership clear ·
one cost/scale trade-off · one thing explicitly out of scope.

## After diag-3
Write `learner.baseline: {debug: x/2 in Nm, review: x/5, design: x/5, note: "<one line>"}`. Set the
queue to the first ladder items of `focus` (run `setup` first if no track exists). Say, in plain
words, what the three numbers suggest — usually fluency (blank-file writing) slips first and
judgment (review, design) holds; say which it is here, with the evidence.
