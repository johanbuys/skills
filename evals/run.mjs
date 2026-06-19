#!/usr/bin/env node
// Eval runner for this skills repo.
//
// Two layers, because the evals are graded in two different ways:
//   1. STRUCTURAL  — every skills/*/evals/evals.json parses, has the required
//      shape, and any declared `fixture` exists on disk. Fully automated,
//      deterministic, CI-able. This is what `validate` checks.
//   2. BEHAVIORAL  — the prose `expected_output` / `assertions` describe how the
//      skill should behave. Grading those needs an agent/LLM judge, not a shell
//      script. `prepare` materializes the fixture world and prints the task so an
//      agent (or you) can run the skill and judge the assertions.
//
// Usage:
//   node evals/run.mjs                 # validate (default)
//   node evals/run.mjs validate
//   node evals/run.mjs list
//   node evals/run.mjs prepare <skill> <id|name> [destDir]
//
// No dependencies; Node 16.7+ (uses fs.cpSync).

import { readdirSync, readFileSync, existsSync, cpSync, mkdtempSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");

function discover() {
  const out = [];
  for (const skill of readdirSync(SKILLS_DIR)) {
    const p = join(SKILLS_DIR, skill, "evals", "evals.json");
    if (existsSync(p)) out.push({ skill, path: p });
  }
  return out.sort((a, b) => a.skill.localeCompare(b.skill));
}

const REQUIRED_EVAL = ["id", "name", "prompt", "expected_output", "assertions"];

function loadAndValidate({ skill, path }) {
  const errs = [];
  const warns = [];
  let data;
  try {
    data = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    return { skill, path, data: null, errs: [`invalid JSON: ${e.message}`], warns };
  }
  if (typeof data.skill_name !== "string") errs.push("missing string `skill_name`");
  if (data.skill_name && data.skill_name !== skill)
    warns.push(`skill_name "${data.skill_name}" != directory "${skill}"`);
  if (!Array.isArray(data.evals)) {
    errs.push("missing array `evals`");
    return { skill, path, data, errs, warns };
  }
  const seenIds = new Set();
  for (const [i, e] of data.evals.entries()) {
    const where = `eval[${i}]${e && e.name ? ` "${e.name}"` : ""}`;
    for (const f of REQUIRED_EVAL)
      if (!(f in e)) errs.push(`${where}: missing \`${f}\``);
    if (e && Array.isArray(e.assertions) && e.assertions.length === 0)
      warns.push(`${where}: empty assertions`);
    if (e && seenIds.has(e.id)) errs.push(`${where}: duplicate id ${e.id}`);
    if (e) seenIds.add(e.id);
    if (e && e.fixture) {
      const fp = join(ROOT, e.fixture);
      if (!existsSync(fp)) errs.push(`${where}: fixture not found: ${e.fixture}`);
      else if (!statSync(fp).isDirectory()) errs.push(`${where}: fixture is not a directory: ${e.fixture}`);
      if (e.fixture_kind && !["home", "cwd"].includes(e.fixture_kind))
        errs.push(`${where}: fixture_kind must be "home" or "cwd"`);
    } else if (e) {
      warns.push(`${where}: no \`fixture\` — behavioral run not wired (structural-only)`);
    }
  }
  return { skill, path, data, errs, warns };
}

function cmdValidate() {
  const reports = discover().map(loadAndValidate);
  let totalEvals = 0, totalErr = 0, totalWarn = 0;
  for (const r of reports) {
    const n = r.data && Array.isArray(r.data.evals) ? r.data.evals.length : 0;
    totalEvals += n;
    const mark = r.errs.length ? "✗" : "✓";
    console.log(`${mark} ${r.skill}  (${n} eval${n === 1 ? "" : "s"})`);
    for (const e of r.errs) { console.log(`    ERROR  ${e}`); totalErr++; }
    for (const w of r.warns) { console.log(`    warn   ${w}`); totalWarn++; }
  }
  console.log(`\n${reports.length} skills · ${totalEvals} evals · ${totalErr} errors · ${totalWarn} warnings`);
  if (totalErr) process.exit(1);
}

function cmdList() {
  for (const r of discover().map(loadAndValidate)) {
    if (!r.data || !Array.isArray(r.data.evals)) continue;
    console.log(`\n${r.skill}`);
    for (const e of r.data.evals)
      console.log(`  [${e.id}] ${e.name}${e.fixture ? `  ← ${e.fixture} (${e.fixture_kind || "?"})` : "  (no fixture)"}`);
  }
}

function cmdPrepare(skill, idOrName, dest) {
  const rep = discover().map(loadAndValidate).find((r) => r.skill === skill);
  if (!rep || !rep.data) { console.error(`no evals for skill "${skill}"`); process.exit(2); }
  const e = rep.data.evals.find((x) => String(x.id) === String(idOrName) || x.name === idOrName);
  if (!e) { console.error(`no eval "${idOrName}" in ${skill}`); process.exit(2); }
  if (!e.fixture) { console.error(`eval "${e.name}" has no fixture to materialize`); process.exit(2); }

  const target = dest ? resolve(dest) : mkdtempSync(join(tmpdir(), `eval-${skill}-`));
  cpSync(join(ROOT, e.fixture), target, { recursive: true });

  const runHint = e.fixture_kind === "home"
    ? `Run the skill with HOME=${target} (so ~/.study resolves into the fixture).`
    : `Run the skill with the working directory at ${target}.`;

  console.log(`# Prepared eval: ${skill} / [${e.id}] ${e.name}`);
  console.log(`# Fixture ${e.fixture} (${e.fixture_kind}) → materialized at:`);
  console.log(target);
  console.log(`\n## Prompt (give this to an agent running the \`${skill}\` skill)\n${e.prompt}`);
  console.log(`\n## ${runHint}`);
  console.log(`\n## Expected\n${e.expected_output}`);
  console.log(`\n## Assertions to judge`);
  for (const a of e.assertions) console.log(`  - ${a}`);
  console.log(`\n# Behavioral grading is by an agent/LLM judge — this command only sets the stage.`);
}

const [cmd, ...rest] = process.argv.slice(2);
switch (cmd) {
  case undefined:
  case "validate": cmdValidate(); break;
  case "list": cmdList(); break;
  case "prepare": cmdPrepare(rest[0], rest[1], rest[2]); break;
  default:
    console.error(`unknown command: ${cmd}\nusage: validate | list | prepare <skill> <id|name> [dest]`);
    process.exit(2);
}
