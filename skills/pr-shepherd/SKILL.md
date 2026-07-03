---
name: pr-shepherd
description: "Shepherd a pull request from reviewed to merge-ready in one loop — run (or ingest) a code review, post the findings on the PR like a real reviewer, triage them with one decision (fix now / file as issue / dismiss), dispatch a fix subagent per finding group, re-review every fix yourself, commit per group, push, and file issues with context for what's deferred. Use it whenever the user wants a PR reviewed-AND-fixed rather than just reviewed — \"review PR 43 and fix the findings\", \"comment the findings on the PR then address them\", \"fix and push and comment on the pr\", \"get this PR merge-ready\" — and whenever review findings arrive from elsewhere (\"we got a review from another agent, here are the findings — assess and address\")."
---

# PR Shepherd

A review that stops at findings leaves the human as the pipeline: paste the findings back, ask for
fixes, check the fixes, ask for the push, ask for the PR comment, ask for issues for the leftovers.
This skill runs that whole loop as one motion, with the human making exactly one decision — the
triage cut — and the agent doing the plumbing. The findings can come from a fresh review or from
someone else's (another agent, a CI bot, a human reviewer); the loop is the same either way.

## Inputs

- **The PR** — a number, a URL, or "the current branch's PR" (`gh pr view --json` finds it). No
  open PR and no number? Say so and stop; this skill doesn't invent a PR.
- **The findings**, from whichever source exists, normalized to one list (file, line, severity,
  what's wrong, suggested fix):
  1. **Run a review** — if a code-review skill is installed, run it at high effort against the
     PR's diff; otherwise do a careful review pass yourself over `gh pr diff`.
  2. **Ingest a pasted review** — findings JSON or prose from another agent/human. Don't take them
     on faith: check each against the actual diff first, and mark the ones that are stale (already
     addressed) or wrong (misread the code) with the evidence. Assessing someone else's review *is*
     part of the job.
  3. **Read the PR's existing review comments** — unresolved threads count as findings too.

## The loop

### 1 · Post the review to the PR

Findings go on the PR before anything else — the PR is the record other reviewers and future
sessions read, and commenting first means the review exists even if the fix loop is cut short.
Inline comments where file + line are known (`gh api repos/:owner/:repo/pulls/<n>/comments` against
the head SHA), one summary review comment for the rest. Be context-aware, like a reviewer who read
the code: anchor each comment to what the diff actually does, skip anything the diff already
handles, and say severity plainly. Never duplicate a comment that's already on the thread.

### 2 · Triage — one decision, then go

Present the findings ranked by severity with a **proposed cut**: *fix now* (correctness, security,
anything that would block merge), *file as issue* (real but deferrable), *dismiss* (wrong or stale,
with the evidence). One word accepts the cut; the human can re-slice it ("fix 1–4, issues for
5–8"). If they're not around, take the conservative cut — fix the correctness/security tier, file
the rest — and say so in the final report.

### 3 · Fix — one subagent per finding group, re-reviewed by you

- **Get on the PR's branch first** — fetch, check out the head branch, pull. Never fix on main or
  a stale checkout.
- Group related findings (same subsystem, same root cause) and dispatch **one fix subagent per
  group** — a cheaper/faster model is fine for the fixing; the judgment stays with you. Each brief
  is scoped: the findings verbatim, the files, test-first where a test can pin the bug, and a
  stop-and-report clause for anything that grows beyond the finding.
- **Re-review every diff yourself** — read it, run the tests. Never take the fixer's word; send
  back what's wrong. You are the reviewer here; the subagent is hands.
- **Commit per finding group**, message naming what it fixes — so the PR's history maps one-to-one
  onto the review and a reviewer can verify fix-by-fix.

### 4 · Close the loop

- Run the project's test/build once more over the combined result, then **push**.
- **Comment the resolution on the PR**: which findings were fixed (finding → commit), which were
  dismissed and why, which became issues.
- **File an issue per deferred finding** with real context — file, line, the finding, why it was
  deferred, a link back to the PR — so "create issues for the rest" never produces context-free
  stubs. Label them consistently (reuse the repo's convention if one exists).
- Reply to / resolve the review threads the fixes addressed, where the API allows it.
- Report: fixed / deferred / dismissed counts, the commits, test results, and anything that still
  blocks merge.

## Hard rules

- **Never merge.** Merge-ready is the deliverable; the merge is the human's call.
- **Never force-push**, and never rewrite commits that were already on the remote.
- **Re-review before you push, every time** — a pushed bad fix costs more than it saves.
- **Stale findings get dismissed with evidence, not silently dropped** — the dismissal comment is
  part of the review record.
- **Tests failing at the end = say so plainly** and leave the loop open; never push-and-hope.

## What this skill is not

- Not the reviewer's brain: when a code-review skill is installed, that skill finds the findings —
  this one shepherds them. Run alone, it reviews as well as it can, but its job is the loop.
- Not a merge bot: it stops at merge-ready, on purpose.
- Not CI: it runs the tests to protect its own pushes; it doesn't replace the pipeline.
