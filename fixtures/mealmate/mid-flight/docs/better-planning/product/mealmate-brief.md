# mealmate — brief

**Status:** settled — 2026-05-26
**Next phase:** better-planning-prd
**Draws on:** [../research/user-interviews-findings.md](../research/user-interviews-findings.md)

> This brief is the alignment record: the decisions and *why*, plus what's still open.
> It is deliberately structure-free — no schemas, no sections, no acceptance criteria.
> When we need structure to say something, brainstorming is over and the PRD takes it.

## Problem

Weekly meal planning is a three-way reconciliation people do badly in their heads: what we
want to eat, what's already home, what to buy. The list never matches the pantry, planning
eats an evening, and mid-week changes turn produce into waste. Research: 11/12 interviewees
buy duplicates; median planning time ~40 minutes.

## Current state

Greenfield — no code exists. This brief and its research are the whole project so far.

## Decided directions

- **The pantry is the hub; everything else derives from it.** Plan from what you have; the
  shopping list is plan-minus-pantry, computed, never hand-derived. — *why:* the #1 and #2
  pains are both symptoms of the pantry living only in people's heads; make it first-class
  and the rest falls out. This is the core bet. (2026-05-23)
- **Mobile-first PWA, no native apps in v1.** — *why:* the phone is the device in the kitchen
  and the shop (12/12); one codebase; installable + offline via service worker covers the
  use case. Native is a distribution optimization, deferred until retention proves out.
  Resolves research T1. (2026-05-24)
- **Recipes are user-entered only in v1 — no scraping, no import.** — *why:* people cook a
  personal repertoire of ~10–20 dishes and ignore imported databases (7/12); scraping is
  brittle and legally murky; entering 15 recipes once is acceptable friction for a motivated
  planner. Import can be a v2 accelerator without changing the model. Resolves research T2.
  (2026-05-25)
- **Pantry entry is manual counts in v1.** — *why:* barcode coverage is worst exactly where
  waste happens (produce, bulk); manual entry makes the sync loop testable end-to-end with
  zero hardware/API dependencies. Barcode is re-examined *inside* the pantry-sync feature PRD
  as a possible accelerator, not as the foundation. Resolves research T3 at the
  fork level; detail question travels to the feature PRD. (2026-05-26)
- **Single-user households in v1; sharing deferred.** — *why:* research T4 splits the
  audience; solo is the bigger interviewed segment and sharing drags in accounts/sync
  infrastructure that would dominate v1. Deliberate cut, revisit with retention data.
  (2026-05-26)

## Open questions

### Fork-level (must land before this brief settles)

*(none — settled 2026-05-26)*

### Detail (the PRD draft can propose answers)

- Barcode scanning scope: accelerator inside pantry-sync, or defer wholesale to v2? → moved
  to the pantry-sync feature PRD decisions table (P7).
- Unit normalization (grams vs "1 jar"): how opinionated is v1? → PRD.
- What happens to the plan when the pantry contradicts it mid-week? → PRD.

## Scope instincts

**In:** pantry with counted stock · user-entered recipe box · week grid planning · derived
shopping list · offline-capable PWA.
**Out (with why):** native apps (distribution, not product) · recipe import/scraping (unused
per research; legal risk) · household sharing (infra weight, split audience) · nutrition
tracking (different product) · grocery-store integrations (partnership-shaped, premature).

## Glossary seeds

pantry · sync · sync event · plan slot · recipe box · shopping list — seeded into
[../GLOSSARY.md](../GLOSSARY.md).

## Evidence

- [../research/user-interviews-findings.md](../research/user-interviews-findings.md) — 12
  interviews; validates problem, not solution. Tensions T1–T4 traced above and in the PRD's
  resolved-decisions table.
