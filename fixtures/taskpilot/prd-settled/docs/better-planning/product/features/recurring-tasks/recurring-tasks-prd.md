# recurring-tasks — PRD

**Status:** settled — 2026-06-20 (draft 2026-06-18 · review round 1 applied 2026-06-19)
**Depends on:** — (briefless entry: user-made fork calls recorded in Decisions below)
**Draws on:** [../../../../plans/old-roadmap.md](../../../../plans/old-roadmap.md) (legacy roadmap — "recurring tasks keep coming up with users")
**Companion:** [recurring-tasks-prd-overview.html](recurring-tasks-prd-overview.html)

> Other features consume this one's contracts: the planned **notifications** feature reads
> occurrence due dates (see Deliberately deferred). Changes to the Task schema below are a
> dependency-surface change.

## Overview

Recurring tasks let a taskpilot user say "water the plants every Tuesday" once and have the
right task show up at the right time, forever — without taskpilot growing a daemon. A task can
carry a schedule (an RRULE string); when the app runs, occurrences of scheduled tasks are
materialized into the store up to a capped lookahead window. The single most important thing
to understand: **generation is lazy and on-run** — taskpilot remains a program that only does
work when the user invokes it.

## User stories

1. As a user, I want to create a task that repeats daily, so that routine chores reappear
   without me re-entering them.
2. As a user, I want to create a task that repeats on specific weekdays (e.g. every Tuesday
   and Thursday), so that my schedule matches real life, not just "every N days".
3. As a user, I want each occurrence to show up in `tp list` like a normal task, so that I
   don't need to learn a second workflow to see what's due.
4. As a user, I want to mark one occurrence done without affecting the series, so that
   completing today's instance doesn't kill the recurrence.
5. As a user, I want to skip one occurrence (deliberately not doing it), so that my history
   distinguishes "skipped" from "done" and from "silently missing".
6. As a user, I want to pause a recurring task, so that a habit I'm suspending (e.g. watering
   plants while away) stops generating clutter.
7. As a user, I want to resume a paused task and NOT be buried under the occurrences I
   "missed" while paused, so that resuming is a fresh start, not a guilt trip.
8. As a user, I want to edit a recurring task's title or schedule and have the change apply
   to future occurrences only, so that my completed history stays true to what I actually did.
9. As a user, I want to delete a recurring task and choose whether pending occurrences go
   with it, so that cleanup is one command, not a hunt.
10. As a user returning after three weeks away, I want the app to catch up sensibly when I
    next run it, so that lazy generation never means broken generation.
11. As a user, I want `tp list` to show which tasks are occurrences of a series, so that I can
    tell a one-off from a recurring instance at a glance.
12. As a user who typos a schedule, I want a clear error at creation time, so that an invalid
    RRULE never enters the store.
13. As a power user, I want to see a series' upcoming occurrences before they're due, so that
    I can plan my week.
14. As a script author driving `tp` from cron or shell scripts, I want stable exit codes and
    machine-parseable list output for occurrences, so that automation doesn't break when
    recurrence ships.
15. As a future feature (notifications), I want occurrence due dates queryable from the store,
    so that reminders can be built without re-deriving schedules.

## Requirements / behavior

- **Creating.** A schedule is attached at creation (`tp add --every <rrule-ish>`); the exact
  CLI surface syntax is a design/plan concern, but the *stored* form is an RRULE string plus a
  `dtstart` anchor (D1). Invalid rules are rejected at creation with a non-zero exit.
- **Generation.** On every `tp` invocation, before the command executes, the store is caught
  up: each active (non-paused) template materializes any occurrences with due dates between
  the last generated point and `now + lookahead window`, capped at 1 year (D2, D3).
  Generation is idempotent — running twice creates nothing twice.
- **Listing.** Occurrences appear in `tp list` as ordinary tasks, marked as belonging to a
  series with their due date visible. Templates themselves are not listed as actionable rows.
- **Completing / skipping.** `tp done <id>` completes one occurrence; `tp skip <id>` marks it
  skipped. Neither touches the template or sibling occurrences (D5).
- **Pausing.** `tp pause <id>` / `tp resume <id>` operate on the template. Paused spans are
  not backfilled on resume; generation restarts from the resume moment (D6).
- **Editing.** Changing a template's title or schedule affects future occurrences only;
  already-materialized occurrences keep the fields they were created with (D7).
- **Time semantics.** Schedules are interpreted in local wall-clock time; a 09:00 task is due
  at 09:00 regardless of DST shifts (D8).

## Contracts & schemas

The store remains one JSON array (`~/.taskpilot.json`). Two task shapes extend the existing
`{ id, title, done, createdAt }`:

```
TemplateTask {
  id, title, createdAt,
  rrule:      string   // RFC 5545 RRULE, e.g. "FREQ=WEEKLY;BYDAY=TU"
  dtstart:    string   // ISO date-time anchor, local wall-clock
  paused:     boolean
  lastGenerated: string // ISO date-time high-water mark for idempotent generation
}

OccurrenceTask {
  id, title, done, createdAt,
  templateId: number   // the series this belongs to
  due:        string   // ISO date-time this occurrence is scheduled for
  skipped:    boolean  // mutually exclusive with done
}
```

Consumers: `tp list` (occurrences only), the future notifications feature (reads `due` on
occurrences). Exit codes: creation with an invalid rule exits non-zero with a one-line reason.

## Acceptance criteria

1. Creating a task with `FREQ=DAILY` and running `tp list` the next day (any command run
   triggers generation) shows a new occurrence for that day.
2. Creating a task with an invalid RRULE string exits non-zero and writes nothing to the store.
3. Running any `tp` command twice in a row generates no duplicate occurrences.
4. `tp done` on an occurrence leaves the template active; the next scheduled occurrence still
   appears.
5. `tp skip` on an occurrence records it as skipped (not done, not deleted); skipped
   occurrences are visible with `tp list --all`.
6. `tp pause` stops generation; running `tp` daily for a week while paused produces zero new
   occurrences; `tp resume` produces occurrences only from the resume point forward.
7. After 30 days of not running taskpilot, the first invocation materializes the missed
   window's occurrences (subject to D9's overdue-collapse rule) and current ones — and
   completes without error.
8. No occurrence is ever materialized with a due date more than 1 year after the moment of
   generation.
9. Editing a template's title changes future occurrences' titles; existing occurrences keep
   the old title.
10. All existing v0.4 behavior (`add`/`list`/`done` on plain tasks) is unchanged for tasks
    without a schedule.

## Edge cases

- **Long absence.** A daily task and a 6-month absence would mean ~180 stale occurrences.
  Per D9: overdue occurrences of the same template collapse to the single most recent one at
  generation time; the collapsed history is not fabricated as individual missed rows.
- **DST boundaries.** Wall-clock interpretation (D8): a 09:00 daily task is due 09:00 in both
  winter and summer time; the UTC instant shifts, never the local time shown to the user.
- **Clock set backwards.** Generation uses the `lastGenerated` high-water mark; a backwards
  clock must not delete or duplicate occurrences (generation simply pauses until real time
  passes the mark).
- **`done` vs `skip` on the same occurrence.** Mutually exclusive; the second command must
  fail with a clear message rather than silently overwrite the first state.
- **Cap boundary.** `FREQ=YEARLY` tasks: exactly one occurrence exists at any time (the next
  one inside the 1-year window).
- **Template deletion with pending occurrences.** The delete command must ask (or take a
  flag) — orphan occurrences referencing a missing `templateId` must never exist.
- **Store written by v0.4.** Old stores lack the new fields; every field is optional-absent
  for plain tasks, and plain tasks pass through generation untouched.
- **Duplicate `tp` invocations racing (two shells).** Last-write-wins is the store's existing
  semantic; generation idempotency keys on `lastGenerated`, so a lost write costs at most a
  regeneration, never a duplicate visible after the next run.

## Deliberately deferred

- **Reminders / notifications** — reminding the user an occurrence is due is its own feature
  with its own delivery-channel questions; this PRD only guarantees the `due` field is there
  to consume. *(Deferred to a `notifications` feature PRD.)*
- **Calendar sync (ICS import/export)** — real demand, but a dependency surface (external
  calendars) that would dominate this feature's risk. Revisit after recurrence ships.
- **Plain-english schedule syntax** ("every other tuesday") — sugar over RRULE; the stored
  contract is settled, the parser can come later without a schema change.
- **Cross-device sync** — out of taskpilot's current product shape entirely (single file,
  single machine).

## Decisions

| # | Decision | Made by | Rationale | Status |
|---|---|---|---|---|
| D1 | Schedules are stored as RFC 5545 RRULE strings on the task, with a `dtstart` anchor | user | standard, expressive, portable to calendar sync later; avoids inventing a schedule DSL | settled |
| D2 | Occurrences are generated lazily when the app runs — no background jobs, no daemon | user | preserves taskpilot's "it's just a file and a CLI" shape; a daemon is a different product | settled |
| D3 | Lookahead is capped at 1 year | user | bounds store growth and generation cost; nothing real is lost (window refills on every run) | settled |
| D4 | Occurrences are materialized as first-class tasks referencing `templateId` (not computed virtually at list time) | draft → review 1 | done/skip state needs a row to live on; virtual rows would fork every command that touches a task | settled |
| D5 | `skip` is a per-occurrence state, distinct from `done` and from delete | draft → review 1 | history should distinguish "chose not to" from "did" — users audit their habits | settled |
| D6 | Pause stops generation; resume does not backfill the paused span | draft → review 1 | resuming a habit should not open with a wall of guilt; the paused span was deliberate | settled |
| D7 | Edits to a template apply to future occurrences only | draft → review 1 | completed history must record what was actually done at the time | settled |
| D8 | Schedules are local wall-clock; DST shifts the instant, never the displayed time | draft → review 1 | "09:00 every day" means 09:00 to a human; single-user local tool needs no TZ plumbing | settled |
| D9 | Overdue occurrences of one template collapse to the single most recent at generation | draft → review 1 | the long-absence case (~180 stale dailies) makes anything else unusable | settled |
