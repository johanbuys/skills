"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

// Point the store at a throwaway file before requiring it.
process.env.TASKPILOT_DB = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "tp-")), "db.json");
const { load, save, nextId } = require("../src/store");

test("load returns [] when the db file does not exist", () => {
  assert.deepStrictEqual(load(), []);
});

test("save/load round-trips tasks", () => {
  const tasks = [{ id: 1, title: "water the plants", done: false, createdAt: "2025-11-02T09:00:00.000Z" }];
  save(tasks);
  assert.deepStrictEqual(load(), tasks);
});

test("nextId is max(id)+1, starting at 1", () => {
  assert.strictEqual(nextId([]), 1);
  assert.strictEqual(nextId([{ id: 3 }, { id: 7 }]), 8);
});
