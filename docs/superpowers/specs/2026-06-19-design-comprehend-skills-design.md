# Design: two new better-planning skills — `design` (TDD phase) and `comprehend` (sync loop)

**Date:** 2026-06-19
**Author:** Johan Buys (brainstormed with agent)
**Status:** Approved design, pending implementation plan

## Problem

The better-planning family takes a fuzzy idea to buildable work: `brainstorm → prd → plan → tasks`.
There is a clear path to *create and plan* features. Two gaps remain on the *technical* side:

1. **No explicit technical-design step.** Architecture, data models, interfaces, stack choices,
   NFRs and technical risks get decided implicitly — buried inside the plan, or worse, inside the
   agent's head during task execution. The human engineer never makes those calls deliberately.

2. **Comprehension erosion during the build (the deeper problem).** As agents write more and more
   code, the human's mental model of the system goes stale. An experienced engineer feels
   *de-skilled and disconnected* from their own codebase. This is not a one-time design gap; it is a
   growing **drift between what the human understands and what actually exists**. It is an
   increasingly common failure mode of agentic coding.

Erosion has two causes:
- **Volume** — too much code lands to read it all.
- **Invisible decisions** — agents make many reasonable *local* architectural calls the human never sees.

## Objective

Keep the human the architect — both at design time and *as the code lands*. Concretely: keep the
human's comprehension and context **high** throughout the build, not just at the start.

## Solution overview — two skills joined by one artifact

The **TDD is the spine.** Skill #1 *creates* it; skill #2 *keeps it living*. That symmetry is the
core of the design. Without a living architectural source of truth, drift is invisible — which is
exactly why comprehension erodes today.

```
①brainstorm → ②prd → ③ design ───────→ ④plan → ⑤tasks → [build/execution]
                      (design-time)                            │
                      creates <feature>-tdd.md                 │ as code lands
                          ▲                                    ▼
                          └────────── ⊕ comprehend ────────────┘
                                  reconciles code ↔ TDD,
                                  keeps the TDD living + the human current
```

- **Skill #1 — `better-planning-design`** (new phase ③, between PRD and plan). Forward-looking:
  decisions *not yet built*, made by the human, taught layered-zoom on the canvas. Produces
  `<feature>-tdd.md`. The plan then **consumes** the TDD instead of re-deciding architecture.
- **Skill #2 — `better-planning-comprehend`** (cross-cutting companion, like canvas — *not* a linear
  phase). Backward-looking: surfaces the consequential deltas between landed code and the TDD,
  teaches them layered-zoom, and reconciles each against the TDD. **The first family skill that
  operates during the build, not planning** — a deliberate expansion of the family's scope past
  planning into execution, justified by the comprehension problem.

### Phase renumbering

Inserting `design` renumbers the linear phases: `design` = ③, `plan` → ④, `tasks` → ⑤.
`comprehend` is marked as a companion (⊕), like canvas — it has no linear number. The "②½ bolt-on"
alternative was rejected as incoherent.

## Skill #1 — `better-planning-design`

- **Artifact:** `<feature>-tdd.md` (+ HTML companion). Named `-tdd`, not `-design`, so it never gets
  confused with the PRD (which engineers also loosely call a "design doc").
- **Entry contract:** opens by reading the `docs/better-planning/` status index (family convention);
  requires a settled feature PRD; routes back to PRD/brainstorm if entered early. Refuses to invent
  product scope — it only translates settled *what/why* into *how*.
- **Defining move — layered zoom, one decision at a time.** The family signature applied to
  architecture. Per technical area:
  1. **System shape** — where this area sits in the whole, as a canvas diagram.
  2. **Boundaries** — the module/component split and the interfaces between them.
  3. **The decision** — the agent's recommendation, the roads not taken, and *why*. The human makes
     the call; it is written immediately with rationale.
  The human can stop at any depth (ratify at system level, or drill into a specific interface).
- **Area selection — risk/consequence-ranked on top of a thin full map.** The agent first lays out
  the **full area map** in one cheap screen (nothing invisible — itself fights erosion), then ranks
  areas by **consequence × irreversibility**, walks the top few deep, mentions the rest briefly. The
  human can **pull any area into focus** at any time. (Rejected: flat per-feature coverage — spends
  attention equally on trivial CRUD and the data model. Rejected: human-drives-selection — assumes a
  map the human is trying to rebuild.) The map *is* the top layer of the zoom.
- **Content set:** system map · data model · key interfaces/contracts · major decisions
  (zoom + alternatives) · technical-risks/unknowns register · NFRs (perf/security/scale targets) ·
  stack/library choices with rationale.
- **Exit:** settled `<feature>-tdd.md` + HTML companion, every decision traceable to where it was
  made. Offers ④ plan next.
- **Line vs. plan:** TDD = the *static design* (structure + decisions). Plan = *how to construct it*
  (sequence, milestones, verification). The plan stops guessing at architecture; it cites TDD sections.

## Skill #2 — `better-planning-comprehend`

- **Artifacts:** the updated `<feature>-tdd.md` (living) + `<feature>-drift.md` (the drift ledger).
- **Cadence:** **both** — auto-prompts at each plan-milestone boundary *and* invokable on-demand
  ("catch me up, what changed, what should I understand now?").
- **Reads:** the TDD (anchor), the plan's milestone definitions (trigger boundaries), and the code
  that landed since the last sync (git diff since the last sync point, recorded in the ledger so it
  knows the window).
- **Core loop — teach + reconcile** (presented, not Socratic — consistent with the design phase):
  1. **Compute deltas**, filtered to the *consequential* ones — changes touching a boundary, a
     contract, the data model, or a TDD decision. Routine within-spec implementation is summarized,
     not walked. *(Antidote to volume.)*
  2. **Teach each delta layered-zoom** on the canvas — system shape → boundary → the decision the
     agent actually made and why, inferred from the code. *(Antidote to invisible decisions.)*
  3. **Reconcile each against the TDD:**
     - **Intentional evolution** → human accepts; the living TDD is updated in place, rationale appended.
     - **Drift** (code diverged from a human decision, unjustified) → logged in the drift ledger,
       flagged for fix.
     - **Undecided** (agent hit a fork the TDD never covered) → becomes a new TDD decision, made now.
  4. **Output:** human's model refreshed, TDD still true, drift ledger as a running record of every
     architectural divergence and its disposition.
- **Drift default — log + surface, the human decides.** Always logs to the ledger AND surfaces in
  session. The human chooses per item: accept-into-TDD, or order a fix. **Never auto-fixes, never
  auto-accepts** — the skill's purpose is keeping the human the decision-maker. (Rejected:
  auto-propose-fix — risks rubber-stamping. Rejected: severity-split auto-accept — the loop should
  not silently judge.)
- **Why it is the novel skill:** today drift is invisible because there is no living source of truth
  to drift *from*. The TDD makes architectural reality checkable; this loop is the check.

## Shared mechanics / DNA

- Both skills use the **canvas** as their surface and **layered zoom** as their teaching grammar.
- Both follow the family invariant: durable artifact carries state across sessions; open by reading
  the status index; route to the right sibling on wrong-phase entry; close by offering the next step.
- Difference between the two: `design` is forward (decisions the human makes before build);
  `comprehend` is backward (decisions the agent already made, surfaced for the human to ratify/reconcile).

## Scope of changes (files touched)

**Key structural fact:** every skill in this family is *fully self-contained* — each `SKILL.md`
embeds the entire family table, and `references/doc-layout.md` + `references/html-artifacts.md` +
`assets/overview-template.html` are duplicated per skill (the maintainer note: "edit all copies
together"). So inserting a phase is a **cross-cutting** change touching every existing skill, not an
additive one. The full list below reflects that; an earlier draft under-counted it.

### New skill directories

- `skills/better-planning-design/` — `SKILL.md`, `references/doc-layout.md`,
  `references/html-artifacts.md`, `assets/tdd-template.md`, `assets/overview-template.html`
  (TDD companion), `evals/evals.json`
- `skills/better-planning-comprehend/` — `SKILL.md`, `references/doc-layout.md`,
  `references/html-artifacts.md`, `assets/drift-ledger-template.md`,
  `assets/overview-template.html` (sync/drift view), `evals/evals.json`

### The embedded family table — update in ALL SKILL.md (4 existing + 2 new)

Every `SKILL.md` carries the full family table (currently 4 rows at lines ~19–25). All must gain the
two new rows and the renumber (`design` ③, `plan` ④, `tasks` ⑤, `comprehend` ⊕). Same for the
README table. This is the single most repetitive edit — do not miss a copy.

### The duplicated `references/doc-layout.md` — 6 copies (4 existing + 2 new)

Each copy needs three edits:
- **Artifact directory tree** — add `<feature>-tdd.md`, `<feature>-tdd-overview.html`, and
  `<feature>-drift.md`.
- **Phase-number annotations** — `<feature>-tasks.md` ④→⑤; add the ③ tdd output line.
- **Status index** — phase vocabulary + example rows gain `design` (states: draft/in-review/settled)
  and `comprehend` (sync checkpoints, not a settle-able phase).

### Concrete handoff / entry-guard strings (not just "pointers")

- `skills/better-planning-prd/SKILL.md` — the closing handoff (≈ line 118) literally offers
  "the implementation plan next (better-planning-plan)"; change to offer ③ `design`.
- `skills/better-planning-plan/SKILL.md` — input framing "consumes the PRD" → "consumes the TDD";
  add a "No TDD → phase-③ gap, offer the sibling" entry guard alongside the existing PRD guard
  (≈ lines 35–38); renumber its own header/table ③→④.
- `skills/better-planning-tasks/SKILL.md` — renumber ④→⑤; forward/next handoff now offers the
  `comprehend` companion as the build-time next step (its backward "offer plan" guard is unchanged).
- `skills/better-planning-brainstorm/SKILL.md` — embedded family table only; its own ① and its
  `Next phase: better-planning-prd` handoff are unchanged.

### Canvas

- `skills/better-planning-canvas/SKILL.md` — add `design` + `comprehend` as canvas consumers.
- New canvas page templates: the **layered-zoom area walk** (design) and the **delta walk**
  (comprehend), alongside the existing `brainstorm-template.html` / `docview-template.html`.
- `assets/brainstorm-template.html:133` example chip ("phase ① brainstorm") — cosmetic, optional.

### README

- Family table: two new rows + renumber. Keep the maintainer duplication note accurate (it now
  spans 6 skills).

## Open items for the implementation plan

- Exact phase-state vocabulary for the status index (`design: draft/in-review/settled`, `comprehend`
  sync checkpoints).
- Drift-ledger format (`assets/drift-ledger-template.md`): per-entry fields — delta, locus, TDD
  reference, disposition, date.
- How `comprehend` records "last sync point" (commit SHA in the ledger vs. a separate marker).
- Canvas page templates for the layered-zoom area walk and the delta walk.

## Rejected alternatives (summary)

- One skill with two modes — rejected: different inputs, timing, and artifacts.
- TDD as optional / plan untouched — rejected: less coherent; plan keeps guessing at architecture.
- TDD absorbs the plan's design content — rejected: larger refactor than warranted now.
- Socratic / predict-first as the teaching move — not chosen; human prefers presented layered-zoom.
- Auto-fix or severity-split drift handling — rejected: undermines the human-as-decision-maker goal.
