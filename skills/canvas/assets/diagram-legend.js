/* canvas diagram legend — loads an agentic-mermaid SVG and makes its states live.
 *
 * The drawing is done ahead of time by scripts/render_diagram.mjs (mermaid ->
 * self-contained SVG). This file adds the one thing a static SVG can't do: the
 * legend. Each canvas state present in the diagram becomes a chip with a count;
 * clicking it hides that state's nodes and every edge touching them — so the
 * user can drop `base` to see only what changed, or isolate the `alert` nodes,
 * with no agent round-trip.
 *
 * It works because the rendered SVG carries the structure: nodes are
 * <g class="node <state>" data-id="…">, edges are <polyline class="edge"
 * data-from data-to>, edge labels are <g class="edge-label" data-from data-to>.
 *
 * Usage — the SVG stays a separate file, so a redrawn round costs no page markup:
 *   <div class="dk" data-diagram-src="architecture.svg"
 *        data-legend='{"base":"unchanged","alert":"drift"}'></div>
 *   <script src="diagram-legend.js"><\/script>   (escaped so this file can also
 *                                                be inlined into a page)
 *
 *   data-legend  optional JSON mapping state -> the consumer's word for it.
 *                Omit for generic state names; use "false" for no legend.
 *   data-caption optional line under the diagram.
 *
 * Already-inline SVG works too: put it in a [data-diagram] container instead.
 * Programmatic: DiagramLegend.attach(containerEl).
 *
 * Needs the page to be served (it fetches the SVG) — that is canvas's normal
 * mode. On file:// the fetch is blocked and the container says so.
 */
(function (global) {
  "use strict";

  var ORDER = ["base", "highlight", "emphasis", "alert", "new"];

  /* Chip paint mirrors the classDefs in scripts/render_diagram.mjs — same five
   * states, same colors, so the legend swatch matches the node it toggles. */
  var STATES = {
    base:      { stroke: "#5b6678", fill: "#ffffff" },
    highlight: { stroke: "#0f62fe", fill: "#eef4ff" },
    emphasis:  { stroke: "#d97706", fill: "#fff7ed" },
    alert:     { stroke: "#dc2626", fill: "#fef2f2" },
    "new":     { stroke: "#059669", fill: "#ecfdf5" }
  };

  function ensureStyles() {
    if (document.getElementById("dk-styles")) return;
    var s = document.createElement("style");
    s.id = "dk-styles";
    s.textContent =
      ".dk-svg{width:100%;height:auto;display:block}" +
      ".dk-legend{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}" +
      ".dk-key{display:inline-flex;align-items:center;gap:7px;cursor:pointer;user-select:none;" +
        "font:650 12.5px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
        "color:#5b6678;background:#fff;border:1px solid #e3e8f0;border-radius:999px;padding:6px 12px}" +
      ".dk-key:hover{border-color:#c9d6ea;background:#f7fafd}" +
      ".dk-key.off{opacity:.45;text-decoration:line-through}" +
      ".dk-sw{width:13px;height:13px;border-radius:4px;border:2px solid}" +
      ".dk-count{color:#8b94a6;font-weight:700}" +
      ".dk-cap{margin:8px 0 0;font:13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#5b6678}" +
      ".dk-err{font:13px/1.5 ui-monospace,Menlo,monospace;color:#b91c1c;background:#fef2f2;" +
        "border:1px solid #fecaca;border-radius:8px;padding:10px 12px}";
    document.head.appendChild(s);
  }

  function stateOf(el) {
    var cls = (el.getAttribute("class") || "").split(/\s+/);
    for (var i = 0; i < cls.length; i++) if (STATES[cls[i]]) return cls[i];
    return "base";
  }

  /* Index the SVG: which state each node id is in, and what each edge connects. */
  function index(svg) {
    var nodes = {}, order = [];
    Array.prototype.forEach.call(svg.querySelectorAll("g.node, [data-role='node']"), function (g) {
      var id = g.getAttribute("data-id");
      // the node's own shape/label carry data-role="node" too — count the group once
      if (!id || id.indexOf("node-shape:") === 0) return;
      var group = g.closest("g.node");
      if (group && group !== g) return;
      if (!nodes[id]) { nodes[id] = { state: stateOf(g), els: [] }; order.push(id); }
      if (nodes[id].els.indexOf(g) === -1) nodes[id].els.push(g);
    });
    // shapes/labels emitted outside the node group still carry node-shape:<id>
    Array.prototype.forEach.call(svg.querySelectorAll("[data-id^='node-shape:']"), function (el) {
      var id = el.getAttribute("data-id").slice("node-shape:".length);
      if (nodes[id] && nodes[id].els.indexOf(el) === -1 && !el.closest("g.node")) nodes[id].els.push(el);
    });

    var edges = [];
    Array.prototype.forEach.call(svg.querySelectorAll("[data-from][data-to]"), function (el) {
      if (el.closest("g.node")) return;
      edges.push({ from: el.getAttribute("data-from"), to: el.getAttribute("data-to"), el: el });
    });
    return { nodes: nodes, order: order, edges: edges };
  }

  function buildLegend(container, svg, labels) {
    var idx = index(svg);
    var counts = {}, present = [];
    idx.order.forEach(function (id) {
      var s = idx.nodes[id].state;
      if (counts[s] === undefined) counts[s] = 0;
      counts[s]++;
    });
    ORDER.forEach(function (s) { if (counts[s]) present.push(s); });
    if (labels === false || present.length < 2) return;

    var hidden = {};
    function apply() {
      idx.order.forEach(function (id) {
        var off = !!hidden[idx.nodes[id].state];
        idx.nodes[id].els.forEach(function (el) { el.style.display = off ? "none" : ""; });
      });
      idx.edges.forEach(function (e) {
        var a = idx.nodes[e.from], b = idx.nodes[e.to];
        var off = (a && hidden[a.state]) || (b && hidden[b.state]);
        e.el.style.display = off ? "none" : "";
      });
    }

    var bar = document.createElement("div");
    bar.className = "dk-legend";
    present.forEach(function (s) {
      var key = document.createElement("button");
      key.type = "button";
      key.className = "dk-key";
      key.title = "Toggle " + ((labels && labels[s]) || s);
      var sw = document.createElement("span");
      sw.className = "dk-sw";
      sw.style.borderColor = STATES[s].stroke;
      sw.style.background = STATES[s].fill;
      var txt = document.createElement("span");
      txt.textContent = (labels && labels[s]) || s;
      var cnt = document.createElement("span");
      cnt.className = "dk-count";
      cnt.textContent = counts[s];
      key.appendChild(sw); key.appendChild(txt); key.appendChild(cnt);
      key.addEventListener("click", function () {
        hidden[s] = !hidden[s];
        key.classList.toggle("off", !!hidden[s]);
        apply();
      });
      bar.appendChild(key);
    });
    container.insertBefore(bar, svg.parentNode === container ? svg : container.firstChild);
  }

  function readLabels(container) {
    var raw = container.getAttribute("data-legend");
    if (raw === null || raw === "") return null;
    if (raw === "false") return false;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function decorate(container, svg) {
    ensureStyles();
    svg.classList.add("dk-svg");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    buildLegend(container, svg, readLabels(container));
    var cap = container.getAttribute("data-caption");
    if (cap) {
      var p = document.createElement("p");
      p.className = "dk-cap";
      p.textContent = cap;
      container.appendChild(p);
    }
    container.setAttribute("data-dk-ready", "1");
  }

  function attach(container) {
    if (container.getAttribute("data-dk-ready")) return;
    var inline = container.querySelector("svg");
    if (inline) { decorate(container, inline); return; }

    var src = container.getAttribute("data-diagram-src");
    if (!src) return;
    ensureStyles();
    // no-store: the page reloads on a version bump and must not show a stale SVG
    fetch(src, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error(r.status + " " + r.statusText);
      return r.text();
    }).then(function (text) {
      container.innerHTML = text;
      var svg = container.querySelector("svg");
      if (!svg) throw new Error("no <svg> in " + src);
      decorate(container, svg);
    }).catch(function (e) {
      container.innerHTML = "";
      var box = document.createElement("div");
      box.className = "dk-err";
      box.textContent = "diagram " + src + " failed to load: " + e.message +
        (location.protocol === "file:" ? " — serve the page (canvas_server.py); file:// blocks the fetch." : "");
      container.appendChild(box);
    });
  }

  function attachAll(root) {
    var sel = "[data-diagram-src], [data-diagram]";
    Array.prototype.forEach.call((root || document).querySelectorAll(sel), attach);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { attachAll(); });
  } else {
    attachAll();
  }

  global.DiagramLegend = { attach: attach, attachAll: attachAll, STATES: STATES, ORDER: ORDER };
})(typeof window !== "undefined" ? window : this);
