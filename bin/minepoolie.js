#!/usr/bin/env node
"use strict";

const { spawn } = require("child_process");

const cmd = process.argv[2];
const args = process.argv.slice(3);

if (!cmd) {
  console.log("Usage: minepoolie <build|test|dashboard|miner|runner|lint> [args]");
  process.exit(1);
}

const child = spawn("node", [`scripts/${cmd}.js`, ...args], {
  stdio: "inherit",
  cwd: process.cwd(),
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
