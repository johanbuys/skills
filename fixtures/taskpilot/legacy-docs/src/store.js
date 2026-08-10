"use strict";
// Flat-file task store. All of taskpilot's state is one JSON array in the
// user's home directory — no daemon, no lockfile, last write wins.
const fs = require("fs");
const os = require("os");
const path = require("path");

const DB_PATH = process.env.TASKPILOT_DB || path.join(os.homedir(), ".taskpilot.json");

function load() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function save(tasks) {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2) + "\n");
}

function nextId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

module.exports = { DB_PATH, load, save, nextId };
