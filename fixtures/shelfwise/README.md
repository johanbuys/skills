# shelfwise (eval fixture)

Fixture world for the brainstorm `brief-appended-as-decisions-land` eval: a nearly-empty
homelab-inventory CLI repo **mid-brainstorm** — one fork question was asked in a previous
exchange (that context arrives in the eval prompt), but no decision had landed yet, so no
`docs/better-planning/` space exists. The eval checks that when the user's answer lands, the
skill creates the space, records the decision with rationale in the brief, and continues
with exactly one next question.

This parent README is not part of the fixture — `prepare` copies `mid-brainstorm/` only, so
the world stays free of eval-harness markers. Not a real project.
