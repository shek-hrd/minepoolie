#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const files = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (entry.name.endsWith(".js")) {
      files.push(p);
    }
  }
}

walk(SRC);

let issues = 0;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length > 120) {
      console.log(`${file}:${i + 1}: line too long (${line.length})`);
      issues++;
    }
  }
}

if (issues === 0) {
  console.log("lint: clean");
} else {
  console.log(`lint: ${issues} issue(s)`);
  process.exit(1);
}
