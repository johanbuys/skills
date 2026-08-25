# Rule tables — applied verbatim in the Log phase. No judgement calls here.

## States and intervals
`introduced → practiced → fluent`. `rusty` is derived (today > due + 14d), never written.
due after a session: introduced +3d · practiced +7d · fluent +30d.

## Transition after a kata
| outcome | state | next due |
|---|---|---|
| green ∧ hints 0 ∧ explain-back 2 ∧ ≤ 10 min | promote one step | interval of new state |
| green ∧ (hints 1–2 ∨ explain-back 1) | keep | half interval |
| green ∧ revealed | keep | +2d, same concept next, new brick |
| not green at 20 | demote one step (floor introduced) | +2d, same concept tomorrow, difficulty −1 |
| green ∧ confidence ≤ 2 | keep; a second kata before promotion | +3d |
| ≥ 3 compile/type errors on one syntax | no change; add a `flags` line; next micro-lesson = that syntax | — |
| drill miss on a `fluent` concept | mark practiced, due today+3 | — |
| drill miss twice on a sharpen-track concept | demote to introduced; one kata on it next | +2d |

## Drill pick
From concepts with `due ≤ today` in ANY track, prefer a sharpen track, then a cluster different
from today's kata; if nothing is due, the concept with the nearest `due`. Never the kata's concept.

## Difficulty (1–5) from the target concept's state
| state | difficulty | shape |
|---|---|---|
| unseen / introduced | 1–2 | one function; signature + all tests given; one edge case |
| practiced | 3 | function + choose the data structure; two edges |
| fluent (review) | 4 | small type/API from a README spec; the learner writes the tests too |
| rusty | 2 | difficulty 2; micro-lesson replaced by a 60-second recall |
Adjust −1 if the last session on this concept had hints ≥ 2 or revealed; +1 if time-to-green ≤ 6 and explain-back 2.

## Next-session pick (first match wins)
1. `queue[0].kind == diagnostic` → that diagnostic (`references/diagnostics.md`).
2. Any concept with `due ≤ today` → review kata (one per session; oldest due first).
3. Last session promoted or green-clean → new: among ladder items in `focus` whose prerequisites are
   ≥ practiced, the one the capstone's next unbuilt brick needs; if none, the lowest on the ladder.
   Prerequisites are hard; the capstone only breaks ties.
4. Last session red/revealed → same concept, difficulty −1, different brick.
5. Session number % 5 == 0 → drill-only "experiment" session (a bigger puzzle, no brick) or, if the
   track has a `design` ladder, a design session: 12-min one-page ADR (context · options · decision ·
   consequences), critiqued against scaling · failure modes · data ownership · cost.
6. ≥ 70% of the focus ladder is practiced+ and nothing due → propose switching `focus` to
   `learner.next_track`, one sentence. The learner edits the file.

## Ladder revision
Every 5th session, before the Log: compare the ladder against the evidence (which items needed
hints, which were trivially green, which got scaffolded ahead of the ladder). Propose at most two
reorderings or merges, one sentence each; the learner says yes/no; edit `tracks/<track>.yaml`.

## Unlogged session (session.json present at start)
Append a log line for it with `green:false`, `note:"unlogged"`, and whatever fields are knowable
from the kata dir (`./check` result, commits). Apply "not green at 20" to its concept. Delete
`.dojo/session.json`. Then open today's session normally.

## Attendance
Per rolling 7 days (target 5). Failed sessions count. Light days count. There is no chain.
