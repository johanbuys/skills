# notifications — PRD

**Status:** in-review — 2026-06-26 (draft 2026-06-24 · review round 1 feedback pending; three fork-level items open)
**Depends on:** [../recurring-tasks/recurring-tasks-prd.md](../recurring-tasks/recurring-tasks-prd.md) → Contracts & schemas (`OccurrenceTask.due`), Deliberately deferred
**Draws on:** [../../../../plans/old-roadmap.md](../../../../plans/old-roadmap.md) ("someday: reminders / notifications?")
**Companion:** [notifications-prd-overview.html](notifications-prd-overview.html)

> ⚠️ **Not settled.** The decisions table below has three open fork-level items (N1 delivery
> channel, N2 checking model, N3 what counts as notifiable). Do not build — and do not design —
> against this document until they land; each one reshapes the contracts section.

## Overview

Notifications close the loop recurring-tasks opened: an occurrence with a `due` date exists in
the store, but nothing tells the user about it unless they happen to run `tp`. This feature
makes taskpilot able to *reach out* — which collides head-on with the product's settled shape
("a program that only does work when you run it", recurring-tasks D2). The single most
important thing to understand: **how the collision resolves is the open question**, and it is
deliberately not answered in this draft.

## User stories

1. As a user, I want to be told when a task is due today, so that I don't have to remember to
   run `tp list`.
2. As a user, I want to be told about overdue tasks, so that things I missed don't silently rot.
3. As a user, I want reminders to respect my focus (no pings at 2am, no pile-ups), so that
   taskpilot stays a tool and never becomes a nag.
4. As a user, I want to snooze a reminder, so that "not now" doesn't mean "lose it".
5. As a user, I want to configure how (and whether) I'm notified per series, so that watering
   plants and paying rent can have different urgency.
6. As a user who lives in the terminal, I want a due-summary where I already look, so that
   notifications don't force a GUI dependency on a CLI tool.
7. As a user with multiple machines, I want to not be double-notified for the same occurrence,
   so that reminders stay trustworthy.
8. As a script author, I want notification behavior to be scriptable/disable-able, so that
   automation runs never trigger user-facing pings.

## Requirements / behavior

*Draft-level; the shape of every item below depends on open decisions N1–N3.*

- A notifiable event exists for: an occurrence becoming due, and an occurrence being overdue
  by a configurable grace period. (What else is notifiable — e.g. "you haven't run tp in a
  week" — is N3, open.)
- Notifications are deduplicated per occurrence: one "due" and at most one "overdue" signal.
- A snooze suppresses re-notification for a chosen interval and never mutates the occurrence.
- Quiet hours suppress delivery; suppressed notifications coalesce into the next allowed
  window rather than being dropped.
- All notification behavior is configurable off, globally and per template.

## Contracts & schemas

*Provisional — blocked on N1/N2.* Whatever the channel, the feature consumes
`OccurrenceTask.due` (recurring-tasks contract) and must persist per-occurrence notification
state (`notifiedAt`, `snoozedUntil`) so that dedup survives restarts. Where that state lives
(in the store file vs a sidecar) is a design-phase call **once** N2 settles the checking model.

## Acceptance criteria

*Draft-level; testable once N1–N3 land.*

1. An occurrence due today produces exactly one due-notification, however many times checking
   runs.
2. Quiet hours produce zero deliveries inside the window and a coalesced delivery after it.
3. `tp` invocations from scripts (non-TTY) never block or ping.
4. Disabling notifications for a template silences it without affecting other templates.

## Edge cases

- **The paused template.** Paused series generate no occurrences — but what about occurrences
  materialized *before* the pause that are now due? (Follows N3.)
- **Overdue collapse interaction.** recurring-tasks D9 collapses overdue occurrences; a user
  away for a month must get one coherent signal, not a burst.
- **Clock jumps / suspend-resume.** A laptop waking from a week's sleep must not fire a week
  of stale pings.
- **Multiple machines sharing a synced store file.** Dedup state written by machine A must
  prevent machine B re-notifying — or the PRD must explicitly scope to one machine (leans on N2).

## Deliberately deferred

- **Email / phone push delivery** — external delivery infrastructure is a different product
  weight class; v1 is local-machine only, whatever channel N1 picks.
- **Natural-language reminder times** ("remind me tonight") — sugar; blocked on the same
  parser question recurring-tasks deferred.

## Decisions

| # | Decision | Made by | Rationale | Status |
|---|---|---|---|---|
| N1 | Delivery channel: desktop notifications (notify-send/osascript) vs terminal-on-run summary vs shell-prompt hook | — | each option trades reach against dependency weight; terminal-only keeps the CLI pure but reaches only users who run tp anyway | **open** |
| N2 | Checking model: does anything run when the user doesn't run `tp`? (cron/systemd timer vs strictly on-run) | — | collides with the settled no-daemon shape (recurring-tasks D2); a timer is not a daemon but is also not nothing — this is the fork that reshapes everything downstream | **open** |
| N3 | What is notifiable in v1: due only, due+overdue, or due+overdue+digest | — | scope of the feature's promise; digest implies scheduling machinery N2 may not provide | **open** |
| N4 | Notifications are deduplicated per occurrence (one due, one overdue signal) | draft | re-pinging destroys trust in the tool faster than missing a ping | proposed |
| N5 | Quiet hours coalesce rather than drop | draft | a suppressed reminder the user never gets is a silent data loss | proposed |
| N6 | Everything off-switchable, globally and per template | draft | a nagging tool gets uninstalled; opt-out must be first-class | proposed |
