#!/usr/bin/env node
"use strict";
// taskpilot — a minimal personal task manager.
//   tp add <title…>    add a task
//   tp list [--all]    list open tasks (--all includes done ones)
//   tp done <id>       mark a task done
const { load, save, nextId } = require("./store");

function usage() {
  console.error("usage: tp add <title> | tp list [--all] | tp done <id>");
  return 1;
}

function main(argv) {
  const [cmd, ...rest] = argv;
  const tasks = load();

  switch (cmd) {
    case "add": {
      const title = rest.join(" ").trim();
      if (!title) return usage();
      const task = { id: nextId(tasks), title, done: false, createdAt: new Date().toISOString() };
      tasks.push(task);
      save(tasks);
      console.log(`added #${task.id}: ${task.title}`);
      return 0;
    }
    case "list": {
      const all = rest.includes("--all");
      for (const t of tasks) {
        if (!all && t.done) continue;
        console.log(`${t.done ? "[x]" : "[ ]"} #${t.id} ${t.title}`);
      }
      return 0;
    }
    case "done": {
      const task = tasks.find((t) => String(t.id) === rest[0]);
      if (!task) {
        console.error(`no task #${rest[0]}`);
        return 1;
      }
      task.done = true;
      save(tasks);
      console.log(`done #${task.id}: ${task.title}`);
      return 0;
    }
    default:
      return usage();
  }
}

process.exit(main(process.argv.slice(2)));
