# GLOSSARY — mealmate planning

Living vocabulary for the better-planning family. Every term used with a precise meaning gets
an entry: **definition**, **not to be confused with**, and **where it's specced**. Update in
the same commit as any change that introduces, renames, or sharpens a term.

---

**Pantry** — the user's current at-home inventory of ingredients, as counted quantities per
unit. The hub of the product: plans draw from it, shopping fills it.
· *Not* the shopping list (what's missing) and *not* a purchase history.
· Specced: pantry-sync-prd.md → Contracts & schemas (PantryItem).

**Sync** — reconciling pantry counts against reality after a real-world event: a shop
(counts go up) or a cooked meal (counts go down). Entirely on-device.
· *Not* cloud/device sync — there is no server in v1.
· Specced: pantry-sync-prd.md → Requirements (sync events).

**Sync event** — one recorded real-world cause of a pantry change: `shop-receipt` or
`meal-cooked`. The event log is what makes counts auditable and corrections possible.
· *Not* a raw count edit (that's a manual adjustment, also recorded, but not an event).
· Specced: pantry-sync-prd.md → Contracts & schemas.

**Plan slot** — one meal position in the week grid (day × meal-type) that a recipe gets
assigned to.
· *Not* a recipe — a slot holds a reference; recipes live in the recipe box.
· Specced: mealmate-prd.md → Features (week-planner summary); detail deferred to the
  week-planner feature PRD.

**Recipe box** — the user's own entered recipes (title, servings, ingredient lines). v1's
only recipe source.
· *Not* an imported/scraped recipe database (explicitly out of v1 — brief, decision 2).
· Specced: mealmate-prd.md → Scope cuts.

**Shopping list** — the computed gap between the week's plan and the pantry: plan's
ingredient demand minus pantry stock, aggregated by unit.
· *Not* hand-maintained; it's derived (the core bet). Manual additions are allowed on top.
· Specced: mealmate-prd.md → Features; detail deferred to the shopping-list-gen feature PRD.
