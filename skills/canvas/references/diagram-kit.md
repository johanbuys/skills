# Canvas Diagram Kit: real diagrams from Mermaid source

The kit draws the shapes an explanation needs — a concept map, an architecture, a flow, a
sequence, a state machine — as clean, self-contained SVG. It is the visual companion to the
comment boxes: those are canvas's shared *interactive* primitive, this is its shared *drawing*
primitive. It renders an **interactive legend** with the diagram (see *The legend*) — one click
hides or shows a whole state, so the user can focus the picture without the agent regenerating it.

Two parts, and the split is the point:

- **`scripts/render_diagram.mjs`** turns Mermaid source into one SVG file, ahead of time. It wraps
  [agentic-mermaid](https://github.com/adewale/agentic-mermaid) — real layered layout, orthogonal
  edge routing that goes *around* nodes, every mermaid family, ~35 looks and palettes. Synchronous:
  no browser, no Puppeteer, nothing fetched at render time.
- **`assets/diagram-legend.js`** adds the one thing a static SVG can't do: the live legend.

The agent authors **only the Mermaid source**. Layout, routing, sizing, and paint are the
renderer's job — the agent reasons about *the graph* (`this connects to that`), never about pixels.

## Putting it on a page

Write the source, render it into the canvas workspace, point the page at it:

```bash
# 1. author  workspace/architecture.mmd
# 2. render (SVG lands next to the page; the server serves it like any file)
node <skill-dir>/scripts/render_diagram.mjs workspace/architecture.mmd \
     --out workspace/architecture.svg --id arch
```

```html
<div class="dk" data-diagram-src="architecture.svg"
     data-legend='{"base":"unchanged","alert":"drift"}'
     data-caption="Where the review phase actually spends its time."></div>

<script src="diagram-legend.js"></script>
```

**Copy `assets/diagram-legend.js` into the workspace** next to the page — same one-time copy as a
template. Keeping the SVG a *separate file* is what makes redraws cheap: a new round re-renders
`architecture.svg` and bumps `version.json`, and the page markup never changes. (For a page that
must survive off the server — `file://` — inline the SVG into a `[data-diagram]` container instead;
the legend attaches to inline SVG too. `assets/diagram-demo.html` is built that way.)

**`--id` matters when a page holds two or more diagrams.** It namespaces the SVG's internal def ids
(arrow markers, gradients); without distinct prefixes the second diagram borrows the first one's
arrowheads. Default is the `--out` basename, which is usually already distinct.

## Authoring the source

Plain Mermaid. Quote any label with punctuation; `flowchart TD` is top-down, `LR` left-to-right.

```
flowchart TD
  composite["composite.run"]:::emphasis
  verify["agreement-verify"]:::highlight
  coordinator["coordinator"]:::alert
  rollup["all-low roll-up"]:::new
  findings["findings"]
  composite -->|fans out| verify
  verify -->|feeds| coordinator
  verify -->|degraded| rollup
  coordinator --> findings
  rollup --> findings
```

`:::state` is the whole state vocabulary — the renderer appends the matching `classDef` itself, so
no page and no source ever repeats the palette. An author-supplied `classDef` always wins.

Pick the family that fits what you're explaining, not the one you always use: `flowchart` for a
graph or a flow, `sequenceDiagram` for an exchange over time, `stateDiagram-v2` for a machine,
`classDiagram` / `erDiagram` for structure, `gantt` for a schedule. All render through the same
one-line call.

## The five states (generic)

| state | reads as | look |
|---|---|---|
| `base` | unchanged / the default | muted gray, white fill |
| `highlight` | touched / changed this pass | accent blue, heavier stroke |
| `emphasis` | grew / matters more | amber, heavy stroke |
| `alert` | something's wrong here | red, dashed border |
| `new` | just appeared | green |

Colors track the page design tokens (`--ink`, `--accent`, `--warn`, `--err`, `--ok`) so a diagram
looks like the rest of the page. The kit is **generic**: it knows these five states and nothing
about any domain. A consumer never invents a sixth state — it maps its vocabulary onto these, in
prose and in the legend labels (the better-planning family maps drift → `alert`, ballooned →
`emphasis`; see `html-artifacts.md` → *Diagram states*).

The class names are a contract between the renderer and the legend. Changing one means changing
both (`scripts/render_diagram.mjs` → `CLASSDEFS`, `assets/diagram-legend.js` → `STATES`).

## The legend (interactive)

`diagram-legend.js` reads the rendered SVG — nodes carry `class="node <state>"` and `data-id`,
edges carry `data-from`/`data-to` — and builds a chip per state **that actually appears**, each
with a count. Clicking a chip hides that state's nodes *and every edge touching them*; clicking
again restores them. So the user can drop `base` to see only what changed, or isolate the `alert`
items, with no agent round-trip.

Label the chips with `data-legend`:

- omitted → chips read the generic state names (`base`, `highlight`, …).
- `data-legend='{"base":"unchanged","emphasis":"grew","alert":"drift"}'` → chips read the consumer's
  words. States you don't name keep their generic label.
- `data-legend="false"` → no legend. It is also skipped automatically when fewer than two states
  are present, since a one-state legend says nothing.

`data-caption="…"` puts a line under the diagram.

## Looks and palettes

`--style` takes a stack, merged left to right — a look plus a palette:

```bash
node render_diagram.mjs arch.mmd --out arch.svg --style publication-figure
node render_diagram.mjs arch.mmd --out arch.svg --style excalidraw,nord-light --seed 7
node render_diagram.mjs --styles          # the full list with one-line blurbs
```

Looks include `hand-drawn`, `excalidraw`, `watercolor`, `blueprint`, `chalkboard`,
`publication-figure`, `patent-drawing`, `accessible-high-contrast`; palettes include `nord`,
`dracula`, `solarized-light`, `github-dark`, `tokyo-night`. `--seed` re-rolls the ink wobble of
sketchy looks and never moves the layout.

**Default to no `--style`.** The default look already matches the canvas design language, and the
state colors are the signal — a sketchy look competes with them. Reach for a style when the
diagram's register is the point: `excalidraw` for a deliberately provisional sketch,
`publication-figure` for something being handed on, `accessible-high-contrast` when asked.

Style colors are baked in at render time, so a palette is chosen per render, not toggled by page CSS.

## Editing without regenerating

The Mermaid source is the source of truth — a *document*, not a drawing. The agent reads it back and
edits it. For a small change to a big diagram, prefer a typed mutation over rewriting the file:

```bash
npx --no-install agentic-mermaid mutate arch.mmd \
    --op '{"kind":"add_node","id":"Cache","label":"Cache"}'
```

`parse → narrow → mutate → verify → serialize` — the ops are typed, so a rename can't silently
corrupt an edge. `am capabilities --json` lists every op per family. The renderer verifies on every
call anyway: a source that would not render never reaches disk.

## When the renderer isn't available

It needs Node ≥ 22 and installs `agentic-mermaid` (~16 MB) into `~/.cache/canvas-diagram` on first
use. Check before committing to a design:

```bash
node <skill-dir>/scripts/render_diagram.mjs --check    # exit 0 usable · 3 not
```

Exit **3** anywhere (from `--check` or a render) means unavailable — no Node, no npm, offline on a
cold cache. **Fall back to `assets/diagram-kit.js`**, the zero-dependency renderer that predates
this one: it takes a `{nodes, edges}` JSON scene, does three simple layouts (`radial`, `row`,
`free`), draws straight lines, and renders the same five states with the same interactive legend.
Lower fidelity, no families beyond a node-and-arrow graph — and a diagram in the simpler kit beats
no diagram. Its scene goes inline on the page, and the same five state names carry over:

```html
<div class="dk" data-diagram>
  <script type="application/json">
  {
    "layout": "radial",                     // "radial" (first node is the hub) | "row" | "free"
    "legend": { "base": "unchanged" },      // or false; same labels as data-legend
    "nodes": [ { "id": "verify", "label": "agreement-verify", "state": "highlight",
                 "shape": "box",            // "box" | "ellipse"
                 "x": 0, "y": 0 } ],        // centers in viewBox units; layout "free" only
    "edges": [ { "from": "verify", "to": "coordinator", "label": "feeds", "state": "base" } ]
  }
  </script>
</div>
<script src="diagram-kit.js"></script>
```

Optional scene fields: `width` (860), `height` (520), per-node `w`/`h`, per-edge `dashed`.

Other exit codes are authoring errors, not fallback signals: **2** bad arguments or Mermaid syntax,
**5** the source parses but would not render (the message names the check that failed, e.g.
`EMPTY_DIAGRAM`). Fix the source. Advisory warnings — `LABEL_OVERFLOW`, `DECISION_BRANCH_UNLABELED`
— print but don't block; they are usually worth fixing, since both mean a reader will stumble.

## Future: the editable board

The source is built to grow into a collaborative whiteboard, turn-based on canvas's existing loop:

1. **Now** — the agent authors the source, the kit renders it read-only, the user comments.
2. **Later** — the browser makes shapes draggable and adds an arrow/rename tool; on submit it posts
   the *edited* graph back through `POST /feedback` instead of (or alongside) comments. The agent
   applies it as typed mutations, re-renders, bumps the version, the board redraws. The likely move
   is to **embed tldraw or excalidraw as the editor**, bridged to the Mermaid document.

Real-time co-editing (CRDTs) is explicitly out: turn-based satisfies "we both edit the same board"
without that complexity.

## What it is not

- Not a chart library — no axes, scales, or data series; that's a different primitive.
- Not a layout you control — you author the graph, the engine places it. Fighting the placement
  usually means the diagram is trying to say too much; split it.
- Not domain-aware — it never hears the words "drift" or "ballooned"; consumers map those on.
