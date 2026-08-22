#!/usr/bin/env node
/* canvas diagram renderer — Mermaid source -> one self-contained SVG file.
 *
 * Wraps `agentic-mermaid` (https://github.com/adewale/agentic-mermaid): real
 * layered layout, orthogonal edge routing, every mermaid family, ~35 looks and
 * palettes. Renders synchronously — no browser, no Puppeteer, no network at
 * render time. The emitted SVG has no external refs, so it drops straight into
 * a canvas page and the page stays self-contained.
 *
 * The five canvas states (base/highlight/emphasis/alert/new) are mermaid
 * classDefs this script appends automatically — author `node:::alert` and the
 * paint plus the interactive legend (assets/diagram-legend.js) just work.
 *
 * Usage:
 *   node render_diagram.mjs <in.mmd|-> --out <out.svg> [options]
 *   node render_diagram.mjs --check          # is the renderer usable here?
 *
 * Options:
 *   --out <file>     write the SVG here (default: stdout)
 *   --id <prefix>    namespace SVG def ids (default: the --out basename).
 *                    REQUIRED to differ per diagram when a page holds 2+.
 *   --style <names>  comma-separated style stack, e.g. publication-figure,paper
 *                    (`node render_diagram.mjs --styles` lists them)
 *   --seed <n>       re-roll ink wobble of sketchy looks; never moves layout
 *   --no-classdefs   don't append the canvas state classDefs
 *   --no-install     fail instead of installing the renderer into the cache
 *   --json           machine-readable result on stdout
 *
 * Exit codes: 0 ok · 2 bad args or mermaid parse error (fix the source) ·
 * 3 renderer unavailable — the "fall back to assets/diagram-kit.js" signal ·
 * 4 internal · 5 verify failed, i.e. this source would not render (fix it).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { homedir } from "node:os";
import path from "node:path";

const PKG = "agentic-mermaid@^0.4.1";
const CACHE = path.join(
  process.env.XDG_CACHE_HOME || path.join(homedir(), ".cache"),
  "canvas-diagram",
);
const MIN_NODE = 22;

/* ---- the five canvas states, as mermaid classDefs ------------------------ */
/* Colors track the page design tokens (--ink/--accent/--warn/--err/--ok) so a
 * diagram looks like the rest of the page. The class names are also what the
 * legend toggles on, so they are a contract — don't rename them here alone. */
const CLASSDEFS = {
  base: "classDef base fill:#ffffff,stroke:#5b6678,stroke-width:1.6px,color:#1a2233",
  highlight: "classDef highlight fill:#eef4ff,stroke:#0f62fe,stroke-width:2.4px,color:#0b3ea8",
  emphasis: "classDef emphasis fill:#fff7ed,stroke:#d97706,stroke-width:2.6px,color:#9a4d05",
  alert: "classDef alert fill:#fef2f2,stroke:#dc2626,stroke-width:2.2px,stroke-dasharray:7 4,color:#b91c1c",
  new: "classDef new fill:#ecfdf5,stroke:#059669,stroke-width:2.2px,color:#047857",
};

function fail(code, msg) {
  process.stderr.write(msg.replace(/\n+$/, "") + "\n");
  process.exit(code);
}

/* ---- args --------------------------------------------------------------- */
function parseArgs(argv) {
  const opts = { input: null, out: null, id: null, style: null, seed: null,
                 classdefs: true, install: true, json: false, mode: "render" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) fail(2, `${a} needs a value`);
      return v;
    };
    if (a === "--check") opts.mode = "check";
    else if (a === "--styles") opts.mode = "styles";
    else if (a === "--out") opts.out = next();
    else if (a === "--id") opts.id = next();
    else if (a === "--style") opts.style = next();
    else if (a === "--seed") opts.seed = Number(next());
    else if (a === "--no-classdefs") opts.classdefs = false;
    else if (a === "--no-install") opts.install = false;
    else if (a === "--json") opts.json = true;
    else if (a === "--help" || a === "-h") opts.mode = "help";
    else if (a.startsWith("--")) fail(2, `unknown flag ${a}`);
    else if (opts.input === null) opts.input = a;
    else fail(2, `unexpected argument ${a}`);
  }
  return opts;
}

/* ---- loading the renderer ----------------------------------------------- */
/* Three tries, cheapest first: already resolvable (repo has it as a dep) ->
 * the canvas cache dir -> install into the cache dir. */
async function loadSdk({ install }) {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < MIN_NODE) {
    return { ok: false, reason: `agentic-mermaid needs Node >= ${MIN_NODE}; this is ${process.versions.node}` };
  }

  const cached = path.join(CACHE, "node_modules", "agentic-mermaid", "dist", "agent.js");
  const tries = [
    () => import("agentic-mermaid/agent"),
    () => (existsSync(cached) ? import(pathToFileURL(cached).href) : Promise.reject(new Error("not cached"))),
  ];
  for (const t of tries) {
    try { return { ok: true, sdk: await t() }; } catch { /* next */ }
  }

  if (!install) return { ok: false, reason: `agentic-mermaid is not installed and --no-install was given` };

  mkdirSync(CACHE, { recursive: true });
  const manifest = path.join(CACHE, "package.json");
  if (!existsSync(manifest)) {
    writeFileSync(manifest, JSON.stringify({ name: "canvas-diagram-cache", private: true }, null, 2) + "\n");
  }
  process.stderr.write(`installing ${PKG} into ${CACHE} (one time, ~16MB)…\n`);
  const r = spawnSync("npm", ["install", "--silent", "--no-audit", "--no-fund", PKG],
                      { cwd: CACHE, stdio: ["ignore", "ignore", "inherit"] });
  if (r.status !== 0) {
    return { ok: false, reason: `npm install failed (exit ${r.status ?? "?"}) — offline, or no npm on PATH` };
  }
  try { return { ok: true, sdk: await import(pathToFileURL(cached).href) }; }
  catch (e) { return { ok: false, reason: `installed but could not import: ${e.message}` }; }
}

const UNAVAILABLE_HINT =
  "Fall back to assets/diagram-kit.js (the zero-dependency renderer) and keep going —\n" +
  "a diagram in the simpler kit beats no diagram.";

/* ---- source prep -------------------------------------------------------- */
/* Append a classDef for each canvas state the source actually uses and does not
 * already define itself. Author-supplied classDefs always win. */
function withClassDefs(source) {
  const used = new Set();
  for (const m of source.matchAll(/:::([a-zA-Z][\w-]*)/g)) used.add(m[1]);
  for (const m of source.matchAll(/^\s*class\s+[^\n]+?\s+([a-zA-Z][\w-]*)\s*$/gm)) used.add(m[1]);
  const add = [...used]
    .filter((s) => CLASSDEFS[s])
    .filter((s) => !new RegExp(`^\\s*classDef\\s+${s}\\b`, "m").test(source))
    .map((s) => CLASSDEFS[s]);
  if (!add.length) return source;
  return source.replace(/\s*$/, "\n") + add.map((l) => "  " + l).join("\n") + "\n";
}

function idPrefixFor(opts) {
  const raw = opts.id || (opts.out ? path.basename(opts.out).replace(/\.svg$/i, "") : "dk");
  // must be a valid start-of-id token, and stable across rounds
  return raw.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/^[^a-zA-Z_]/, "d$&") + "-";
}

/* ---- main --------------------------------------------------------------- */
const opts = parseArgs(process.argv.slice(2));

if (opts.mode === "help") {
  const banner = readFileSync(new URL(import.meta.url), "utf8").split("*/")[0];
  process.stdout.write(banner.replace(/^#!.*\n/, "").replace(/^\/\* ?|^ \* ?| \*$/gm, "") + "\n");
  process.exit(0);
}

const loaded = await loadSdk(opts);

if (opts.mode === "check") {
  const out = loaded.ok
    ? { available: true, node: process.versions.node }
    : { available: false, node: process.versions.node, reason: loaded.reason };
  if (opts.json) process.stdout.write(JSON.stringify(out) + "\n");
  else process.stdout.write(loaded.ok ? "renderer available\n" : `renderer unavailable: ${loaded.reason}\n${UNAVAILABLE_HINT}\n`);
  process.exit(loaded.ok ? 0 : 3);
}

if (!loaded.ok) fail(3, `renderer unavailable: ${loaded.reason}\n${UNAVAILABLE_HINT}`);
const sdk = loaded.sdk;

if (opts.mode === "styles") {
  for (const s of sdk.knownStyleDescriptors()) {
    process.stdout.write(`${String(s.inputName).padEnd(26)} ${String(s.kind).padEnd(8)} ${s.spec?.blurb || ""}\n`);
  }
  process.exit(0);
}

if (!opts.input) fail(2, "usage: render_diagram.mjs <in.mmd|-> --out <out.svg> [--style names] [--id prefix]");

let source;
try {
  source = opts.input === "-" ? readFileSync(0, "utf8") : readFileSync(opts.input, "utf8");
} catch (e) {
  fail(2, `cannot read ${opts.input}: ${e.message}`);
}
if (!source.trim()) fail(2, "empty diagram source");
if (opts.classdefs) source = withClassDefs(source);

/* verify before we commit anything to disk — a clean verify proves it renders */
const describe = (w) => {
  const { code, ...rest } = w;
  const detail = Object.entries(rest).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(" ");
  return detail ? `${code} (${detail})` : code;
};
let warnings = [];
try {
  const parsed = sdk.parseRegisteredMermaid(source);
  if (!parsed.ok) {
    const errs = Array.isArray(parsed.error) ? parsed.error : [parsed.error];
    fail(2, "mermaid parse failed:\n" + errs.map((e) => `  ${e?.message || e?.code || e}`).join("\n"));
  }
  const verdict = sdk.verifyMermaid(parsed.value);
  warnings = verdict.warnings || [];
  /* verify.ok is the authority: false means this source would not render */
  if (!verdict.ok) fail(5, "verify failed:\n" + warnings.map((w) => "  " + describe(w)).join("\n"));
} catch (e) {
  fail(4, `verify crashed: ${e.message}`);
}

let svg;
try {
  svg = sdk.renderMermaidSVG(source, {
    idPrefix: idPrefixFor(opts),
    security: "strict",
    ...(opts.style ? { style: opts.style.split(",").map((s) => s.trim()).filter(Boolean) } : {}),
    ...(Number.isFinite(opts.seed) ? { seed: opts.seed } : {}),
  });
} catch (e) {
  fail(4, `render failed: ${e.message}`);
}

/* the page owns the width; the SVG keeps its aspect via viewBox */
svg = svg.replace(/^<svg /, '<svg class="dk-svg" ');

if (opts.out) {
  mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true });
  writeFileSync(opts.out, svg);
}

if (opts.json) {
  process.stdout.write(JSON.stringify({
    ok: true, out: opts.out || null, bytes: svg.length, warnings,
  }) + "\n");
} else {
  if (!opts.out) process.stdout.write(svg);
  for (const w of warnings) process.stderr.write("  " + describe(w) + "\n");
  if (opts.out) process.stderr.write(`wrote ${opts.out} (${svg.length} bytes)\n`);
}
